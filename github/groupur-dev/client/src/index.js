import React, { Component } from 'react';
// import { render } from 'react-dom';
import ReactDOM from "react-dom";
import App from './components/App'

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

import reducers from './reducers';
import Routes from './routes';

// import style from './css/style.css';


ReactDOM.render(
  <Provider store={createStore(reducers, applyMiddleware(ReduxThunk))}>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </Provider>, 
  document.getElementById('contents')
);