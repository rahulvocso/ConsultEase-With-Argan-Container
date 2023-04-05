const initialState = {
  messages: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'message':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };

    case 'leave':
      return initialState;
    default:
      return state;
  }
};

export default reducer;
