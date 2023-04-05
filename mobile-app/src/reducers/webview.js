// Define initial state
const initialState = {
    isCallViewOn: false,
    calleeDetails: {},
};

// Define reducer function
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CALL_VIEW_ON':
      return {
        ...state,
        isCallViewOn: action.payload
      };
      case 'SET_CALLEE_DETAILS':
        return {
          ...state,
          calleeDetails  : action.payload
        };
    default:
      return state;
  }
}

export default reducer;
