import axios from 'axios';


export function createGroup(group) {
  const request = axios.post('/add-group', group)
    .then(response => response.data);
  console.log('trying to add group..')

  return {
    
    type: 'ADD_GROUP',
    payload: request
  }
}