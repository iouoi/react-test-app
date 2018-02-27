export default function (state = {}, action) {
  switch (action.type) {
    // case 'GET_GROUPS':
    //   // return previous state, and something inside 'list'
    //   return { ...state, list: action.payload } // list of groups


    case 'ADD_GROUP':
      // return {...state, newgroup: action.payload};


    default:
      return state;
  }
}