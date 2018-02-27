import React, { Component } from 'react';
import { render } from 'react-dom';

// Presentation component function
const Login = (props) => {

  return (
    <div id='sign'>
      <h2>Groupur</h2>
      <h3>Join other buyers for saving</h3>
      <ul id='signInfo'>
        <li><input className='inputBox' id='user-input' type='text' placeholder='Username'/></li>
        <li><input className='inputBox' id='password-input' type='password' placeholder='Password'/></li>
      </ul>
      <ul id='signButtons'>
        <li>
          <button className='signBox' id='log-in' type='submit' onClick={props.handleClick}>
            Log in
          </button>
        </li>
        <li>
          <button className='signBox' id='sign-in' type='submit' onClick={props.handleClick}>
            Sign up
          </button>
        </li>
      </ul>
    </div>
  )
}

module.exports = Login