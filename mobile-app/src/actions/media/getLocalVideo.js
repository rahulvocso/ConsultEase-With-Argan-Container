import { mediaDevices } from 'react-native-webrtc';
import store from '../../store';
import Utils from '../../utils';
import releaseLocalVideo from './releaseLocalVideo';

const getLocalVideo = () => async (dispatch) => {
  dispatch({ type: 'switching', value: true, kind: 'camera' });
  dispatch({ type: 'local-video', data: {} });
  const { device, transports, live, settings } = store.getState().media;

  if (!device.canProduce('video')) {
    return dispatch({ type: 'snack', severity: 'error', content: 'camera not found' });
  }

  try {
    const stream = await mediaDevices.getUserMedia({ video: { facingMode: settings.facingMode } });

    if (!live) {
      dispatch({ type: 'local-video', data: { stream } });
      return dispatch({ type: 'switching', value: false });
    }

    const track = stream.getVideoTracks()[0];
    track.onended = () => {
      dispatch(releaseLocalVideo());
    };
    Utils.logger.info('video track', track);
    const params = { track, appData: { kind: 'video', facingMode: settings.facingMode } };

    const producer = await transports.producer.produce(params);
    dispatch({ type: 'local-video', data: { stream, producer } });
  } catch (err) {
    Utils.logger.info('video produce error', err);
    dispatch(releaseLocalVideo());
    dispatch({ type: 'snack', severity: 'error', content: 'camera not available' });
  }
  dispatch({ type: 'switching', value: false });
};

export default getLocalVideo;
