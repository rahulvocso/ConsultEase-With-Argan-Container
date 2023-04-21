// Define initial state
const initialState = {
  isCallViewOn: false,
  calleeDetails: {},
  consulteaseUserProfileData: {},
};

// Define reducer function
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CALL_VIEW_ON':
      return {
        ...state,
        isCallViewOn: action.payload,
      };
    case 'SET_CALLEE_DETAILS':
      return {
        ...state,
        calleeDetails: action.payload,
      };
    case 'SET_CONSULTEASE_USER_PROFILE_DATA':
      return {
        ...state,
        consulteaseUserProfileData: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
