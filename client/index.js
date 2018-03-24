import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

// const { registerObserver } = require('./../react-perf-devtool/src/npm/hook.js')

// const options = {
//   shouldLog: true,
//   port: 8080
// }

// function callback(measures) {
//   console.log(measures)
// }

// registerObserver()

render(
  <App />,
  document.getElementById('root')
);
