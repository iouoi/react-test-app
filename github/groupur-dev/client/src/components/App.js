import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login'
import MainPage from './MainPage'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      activeSession: false,
      userData: {}
    };
    this.handleClick = this.handleClick.bind(this);
    this.addGroup = this.addGroup.bind(this);
  }


  addGroup(){
    let value = document.getElementById('Group').value

    fetch('/add-group', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({value: value})
    })
    .then(e => {
      return e.json()
    })
    .then(data => {
      console.log(data)
    })
  }


  // check wether there is cookie in the browser or not.
  // if not, render Login; if true, render UserMain
  componentDidMount() { 
    fetch('/verify', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    })
    .then((res) => {
      // console.log(res)
      if (res.status !== 200) {
        return 
      }
      return res.json() // sessionController.verifyUser defines data's structure in its res.send(true)
    })
    .then((data) => { 
      // console.log(data)
      let tempState = this.state;
      tempState.activeSession = data.status;
      this.setState(tempState);
    })
    .catch(e => 
      console.log(e))
  }


  handleClick(event) {    
    const username = document.getElementById('user-input').value;
    const password = document.getElementById('password-input').value;
    console.log('username: ' + username + '...... password: ' + password)
    
    if (!username || !password) {
      return false;
    }

    document.getElementById('user-input').value = null;
    document.getElementById('password-input').value = null;

    const route = (event.target.id === 'log-in' ? '/login' : '/signup');
    console.log(route)


    fetch(route, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, password: password})
    })
    .then((res) => {
      if (res.status < 300 && res.status >= 200) return res.json();
    })
    .then((res) => {
      console.log(res)
      if (res.message) return console.log(res.message);
      let currentState = Object.assign(this.state); 
      //  does not copy memory address but data
      // currentState.userData = res;    // this res (response) from verifyuser has all the info of the user
      if (res.activeSession) currentState.activeSession = true;
      /*if (res)*/ this.setState(currentState);
    });
  }


  // check wether there is cookie in the browser or not.
  // if not, render Login; if true, render UserMain
  componentDidMount() { 
    fetch('/verify', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    })
    .then((res) => {
      if (res.status !== 200) {
        return 
      }
      return res.json() // sessionController.verifyUser defines data's structure in its res.send(true)
    })
    .then((data) => { 
      let tempState = this.state;
      tempState.activeSess = data.status;
      this.setState(tempState);
    })
  }

  render() {      
    return (
      // this.state.activeSes ? <UserMain userData={this.state.userData}
      //                                  addGroup ={this.addGroup} 
      //                                  addItem={this.addItem} 
      //                                  deleteItem={this.deleteItem} 
      //                                  leaveGroup={this.leaveGroup}/> : 
      //                                  <Login handleClick={this.handleClick} /> 
      this.state.activeSession ? <MainPage addGroup={this.addGroup} /> : <Login handleClick={this.handleClick}/>
    );
  }
}

module.exports = App