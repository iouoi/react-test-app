import React, { Component } from 'react';
import { render } from 'react-dom';

// Presentation component function
const UserMain = (props) => {

  function addItemHelper() {
    props.addItem(props.myGroup.groupId);
  }

  function deleteItemHelper() {
    props.deleteItem(props.myGroup.groupId);
  }

  function leaveItemHelper() {
    props.leaveItem(props.myGroup.groupId);
  }
  
  return (
    <div>
      <img className='productPic' src='client/icons/profile.png'/>   
      <button className='ugb' href='#'>{props.myGroup}</button>
      <button className='ugb' href='#' onClick={addItemHelper}>Add item</button>
      <button className='ugb' href='#' onClick={deleteItemHelper}>delete item</button>
      <button className='ugb' href='#' onClick={leaveGroupHelper}>Leave group</button> 
    </div>
  )
}