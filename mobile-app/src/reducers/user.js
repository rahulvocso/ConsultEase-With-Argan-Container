const initialState = {
  name: '',
  email: '',
  errors: {
    name: null,
    email: null,
  },
};

const reducer = (state = initialState, action) => {
  if (typeof action.value === 'string' && action.value === '') {
    action.value = null;
  }
  switch (action.type) {
    case 'user-name':
      return {
        ...state,
        name: action.value,
        errors: {
          ...state.errors,
          name: null,
        },
      };
    case 'user-email':
      return {
        ...state,
        email: action.value,
        errors: {
          ...state.errors,
          email: null,
        },
      };
    case 'user-errors-name':
      return {
        ...state,
        errors: {
          ...state.errors,
          name: action.error,
        },
      };
    case 'user-errors-email':
      return {
        ...state,
        errors: {
          ...state.errors,
          email: action.error,
        },
      };
    case 'user-errors-clear':
      return {
        ...state,
        errors: {
          name: null,
          email: null,
        },
      };
    default:
      return state;
  }
};

export default reducer;
