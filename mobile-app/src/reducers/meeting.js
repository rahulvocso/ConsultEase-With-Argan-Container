import randomWords from 'random-words';

const initialState = {
  key: randomWords(4).join('-'),
  errors: {
    key: null,
  },
  room: null,
  ended: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'meeting-key':
      return {
        ...state,
        key: action.value,
        ended: false,
      };
    case 'meeting-key-random':
      return {
        ...state,
        key: randomWords(4).join('-'),
        ended: false,
        errors: { ...initialState.errors },
      };
    case 'meeting-errors-clear':
      return {
        ...state,
        errors: { ...initialState.errors },
      };
    case 'meeting-errors-key':
      return {
        ...state,
        errors: {
          ...state.errors,
          key: action.error,
        },
      };
    case 'meeting-room':
      return {
        ...state,
        room: action.value,
        ended: false,
      };
    case 'leave':
      return {
        ...state,
        ended: true,
      };
    default:
      return state;
  }
};

export default reducer;
