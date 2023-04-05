const initialState = {
  id: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'socket':
      return {
        ...state,
        id: action.id,
      };
    default:
      return state;
  }
};

export default reducer;
