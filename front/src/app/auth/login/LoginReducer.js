import { cloneDeep } from 'lodash';

const initState = {};

const login = (state = initState, action) => {
  const nextState = {...state};

  switch (action.type) {
    case 'LOGIN_ERROR':
      nextState.error = action.error;
      return nextState;

    case 'START_LOGIN':
      nextState.error = undefined;
      nextState.blockchain = action.blockchain;
      nextState.identity = action.identity;
      return nextState;

    case 'START_LOGIN_SUCCESS':
      nextState.startLoginData = action.startLoginData;
      return nextState;

    case 'FINISH_LOGIN':
      nextState.error = undefined;
      nextState.blockchain = action.blockchain;
      nextState.identity = action.identity;
      nextState.signedData = action.signedData;
      return nextState;

    case 'FINISH_LOGIN_SUCCESS':
      nextState.token = action.token;
      return nextState;

    default:
      return state;
  }
};

export default login;