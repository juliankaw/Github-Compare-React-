import React, {Component} from 'react';
import moment from 'moment';
import Logo from '../../assets/logo.png';
import {Container, Form} from './style';
import CompareList from '../../components/CompareList';
import api from '../../services/api';

export default class Main extends Component{
  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: '',
    repositories: [],
  };

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    try{
      const {data: repository}  = await api.get(`/repos/${this.state.repositoryInput}`);

      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repositoryInput: '',
        repositories: [...this.state.repositories, repository],
        repositoryError: false,
      })
    } catch (err){
      this.setState({ repositoryError: true});
    } finally {
      this.setState({loading: false})
    }
  }

  removeRepo = (id) => {
    let repos = this.state.repositories.filter(repo => {
      return repo.id !== id
    });
    this.setState({
      repositories: repos
    })
  }

  updateRepo = async (id) => {
    const repository = this.state.repositories.find(repo => repo.id == id);

    try{
      const {data}  = await api.get(`/repos/${repository.full_name}`);

      data.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState({
        repositoryError: false,
        repositoryInput: '',
        repositories: this.state.repositories.map(repo => (repo.id === data.id ? data : repo)),
      })
    } catch (err){
      this.setState({ repositoryError: true});
    }
  }

  render(){
    return (
      <Container>
        <img src={Logo} alt="Github Compare"/>


        <Form withError={this.state.repositoryError} onSubmit={this.handleAddRepository}>

          <input type="text" placeholder="usuário/repositório" value={this.state.repositoryInput}
          onChange={e => this.setState({ repositoryInput: e.target.value })}/>

          <button type="submit">{this.state.loading ? <i className="fa fa-spinner fa-pulse"/>:'OK'}</button>
        </Form>

        <CompareList updateRepo={this.updateRepo} removeRepo={this.removeRepo} repositories={this.state.repositories}/>
      </Container>
    );
  }
}

