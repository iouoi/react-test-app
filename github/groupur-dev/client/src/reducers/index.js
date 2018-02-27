import { combineReducers } from 'redux';
import groups from './groups_reducer';
import user from './user_reducer';

const rootReducer = combineReducers({
  groups,
  user
});

export default rootReducer;