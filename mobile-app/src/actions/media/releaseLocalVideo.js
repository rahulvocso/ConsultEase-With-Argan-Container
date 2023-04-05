import store from '../../store';
import Utils from '../../utils';

const releaseLocalVideo = () => async (dispatch) => {
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
  dispatch({ type: 'local-video', data: null });
};

export default releaseLocalVideo;
