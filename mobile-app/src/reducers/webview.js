// Define initial state
const initialState = {
  isCallViewOn: false,
  consulteaseUserProfileData: {},
  calleeDetails: {},
  calleeSocketId: undefined,
  callInstanceData: {},
  callId: undefined,
  isInternetConnected: undefined,
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

    case 'SET_CALLEE_SOCKET_ID':
      return {
        ...state,
        calleeSocketId: action.payload,
      };

    case 'SET_CONSULTEASE_USER_PROFILE_DATA':
      return {
        ...state,
        consulteaseUserProfileData: action.payload,
      };

    case 'RESET_WEBVIEW_DERIVED_DATA':
      return state;

    case 'SET_CALL_INSTANCE_DATA':
      return {
        ...state,
        callInstanceData: action.payload,
      };

    case 'SET_CALL_ID':
      return {
        ...state,
        callId: action.payload,
      };

    case 'SET_INTERNET_CONNECTION':
      return {
        ...state,
        isInternetConnected: action.payload,
      };

    default:
      return state;
  }
}

export default reducer;
