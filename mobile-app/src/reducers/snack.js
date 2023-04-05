const initialState = {
  open: false,
  content: '',
  icon: 'clipboard',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'switching':
      if (action.value) {
        return {
          ...state,
          open: true,
          content: `switching ${action.kind}`,
          icon: null,
        };
      } else {
        return {
          ...state,
          open: false,
        };
      }
    case 'snack':
      return {
        ...state,
        open: true,
        content: action.content,
        icon: action.icon,
      };
    case 'snack-out':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

export default reducer;
