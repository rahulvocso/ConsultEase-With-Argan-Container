import dayjs from 'dayjs';
import Utils from '../../utils';
import store from '../../store';

const sendMessage =
  ({ content }) =>
  async (dispatch) => {
    const { uuid } = store.getState().media;
    const { key } = store.getState().meeting;
    const { name, email } = store.getState().user;
    const data = {
      uuid,
      key,
      content,
      name,
      email,
      date: dayjs().toISOString(),
    };
    dispatch({ type: 'message', message: data });
    Utils.logger.info('sending message', data);
    await Utils.socket.request('message', data);
  };

export default sendMessage;
