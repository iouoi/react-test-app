import React, { Component } from 'react';
import { render } from 'react-dom';

// props being passed down from parent. 
// information is being saved on the client side currently. Nothing is being passed from server. 

const MainPage = (props) => {

    return (
      // initial header
      <div id='userMain'>
        <div className='header'>
          <ul className='list' id='headerList'>
            <li><h3> Groupur </h3></li>
            <li><a className='icon' href='/profile'><img src='client/icons/profile.png'/></a></li>
            <li><a className='icon' href='/'><img src='client/icons/logout.png'/></a></li>
          </ul>
        </div>

        <div className='main'>
          <div className='userMain'>
            <h3> Your Groups </h3>
            <div className='frame'>
              <ul id='userGroupList'>
                <li>          
                { /* 
                  pass down action from app. Update the state and refresh
                  query and list data from database. On each group, add a button that allows for deletion. 
                  When button is pressed, delete the group from the database. Update the displayed group under your group. 
                 */
                }
                </li>
              </ul>
            </div>
            
            <div>
              <form onClick={props.addGroup}> 
                <input id='Group' type='text' name='GroupInput' placeholder='Enter name here'/> 
                <input type='submit'/> 
              </form>
            </div>
          </div>


          <div className='groupsMain'>
            <h3> Groups Available </h3>
            <div className='frame'>
              <ul id='groupsList'>
                <li><button className='userGroup' href='#'>{props.allGroups}</button></li>
              </ul>
            </div>
          </div>
        </div>

       

      </div>
    );
  }  

 // four divs. There is a main div with three nested children (your groups / groups available / footer)
 // each div has additional nesting.. -_-.  

module.exports = MainPage

 // <div className='col-md-12 footer'>
 //          <ul className='list' id='footerList'>
 //            <li><a className='list' href='#'>ABOUT US</a></li>
 //            <li><a className='list' href='#'>SUPPORT</a></li>
 //            <li><a className='list' href='#'>BLOG</a></li>
 //            <li><a className='list' href='#'>JOBS</a></li>
 //            <li><a className='list' href='#'>PRIVACY</a></li>
 //            <li><a className='list' href='#'>TERMS</a></li>
 //            <li><a className='list' href='#'>DIRECTORY</a></li>
 //            <li><a className='list' href='#'>LANGUAGE</a></li>
 //          </ul>
 //        </div>