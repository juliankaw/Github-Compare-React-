import React, { Fragment } from 'react';
import styled from 'styled-components';
import GlobalStyle from './styles/global';
import Main from './pages/Main';

const App = () => (
  <Fragment>
    <GlobalStyle />
    <Main/>
  </Fragment>
)

export default App;
