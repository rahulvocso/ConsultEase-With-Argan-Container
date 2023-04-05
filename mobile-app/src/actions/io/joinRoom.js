import Utils from '../../utils';
import store from '../../store';

const joinRoom = (key) => async (dispatch) => {
  const { uuid } = store.getState().media;
  const room = await Utils.socket.request('joinRoom', { key, uuid });
  Utils.logger.info(`socket.io: joined room ${room}`);
  dispatch({ type: 'meeting-room', value: room });
};

export default joinRoom;
