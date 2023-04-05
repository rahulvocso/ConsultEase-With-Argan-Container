import store from '../../store';
import Utils from '../../utils';

const releaseLocalAudio = () => async (dispatch) => {
  const { uuid } = store.getState().media;
  const { key } = store.getState().meeting;
  const data = store.getState().media.local.audio;
  if (data) {
    if (data.stream) {
      data.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    Utils.logger.info('local audio released');
    if (data.producer) {
      try {
        data.producer.pause();
        Utils.logger.info('audio producer paused');
      } catch (e) {
        Utils.logger.error('error while closing audio producer', e);
      }
      await Utils.socket.request('closeProducer', {
        uuid,
        kind: 'audio',
        id: data.producer.id,
        key,
      });
    }
  }
  dispatch({ type: 'local-audio', data: null });
};

export default releaseLocalAudio;
