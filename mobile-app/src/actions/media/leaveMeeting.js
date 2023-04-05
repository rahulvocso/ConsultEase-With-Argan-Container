import Utils from '../../utils';
import store from '../../store';
import releaseLocalVideo from './releaseLocalVideo';
import releaseLocalAudio from './releaseLocalAudio';

const leaveMeeting = () => async (dispatch) => {
  Utils.logger.info('leaving meeting');
  const { uuid, local } = store.getState().media;
  const { key } = store.getState().meeting;
  if (local.audio) {
    dispatch(releaseLocalAudio());
  }
  if (local.video) {
    dispatch(releaseLocalVideo());
  }
  const peers = await Utils.socket.request('leave', { uuid, key });
  dispatch({ type: 'peers', peers });
  dispatch({ type: 'leave' });
  Utils.logger.info('meeting ended');
};

export default leaveMeeting;
