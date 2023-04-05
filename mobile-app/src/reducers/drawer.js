const initialState = {
  open: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'drawer':
      return {
        ...state,
        open: action.value,
      };
    default:
      return state;
  }
};

export default reducer;
