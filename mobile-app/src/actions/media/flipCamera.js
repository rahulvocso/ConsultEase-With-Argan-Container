import { mediaDevices } from 'react-native-webrtc';
import store from '../../store';
import Utils from '../../utils';
import releaseLocalVideo from './releaseLocalVideo';

const flipCamera = () => async (dispatch) => {
  dispatch({ type: 'switching', value: true, kind: 'camera' });
  dispatch({ type: 'facing-mode' });

  const { uuid } = store.getState().media;
  const { key } = store.getState().meeting;
  const data = store.getState().media.local.video;
  if (data) {
    if (data.stream) {
      data.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    Utils.logger.info('local video released');
    if (data.producer) {
      try {
        data.producer.pause();
        Utils.logger.info('video producer paused');
      } catch (e) {
        Utils.logger.error('error while closing video producer', e);
      }
      await Utils.socket.request('closeProducer', {
        uuid,
        kind: 'video',
        id: data.producer.id,
        key,
      });
    }
  }

  const { device, transports, live, settings } = store.getState().media;

  if (!device.canProduce('video')) {
    return dispatch({ type: 'snack', severity: 'error', content: 'camera not found' });
  }

  try {
    const stream = await mediaDevices.getUserMedia({ video: { facingMode: settings.facingMode } });

    if (!live) {
      return dispatch({ type: 'local-video', data: { stream } });
    }

    const track = stream.getVideoTracks()[0];
    track.onended = () => {
      dispatch(releaseLocalVideo());
    };
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

export default flipCamera;
