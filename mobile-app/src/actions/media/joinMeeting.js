import Utils from '../../utils';
import store from '../../store';
import releaseLocalVideo from './releaseLocalVideo';
import releaseLocalAudio from './releaseLocalAudio';

const joinMeeting = () => async (dispatch) => {
  const { device, live, local, transports, uuid } = store.getState().media;
  if (live) {
    return;
  }
  Utils.logger.info('joining meeting');
  const { name, email } = store.getState().user;
  const { key } = store.getState().meeting;
  const { peers, producers } = await Utils.socket.request('join', {
    name,
    email,
    uuid,
    key,
  });
  dispatch({ type: 'peers', peers });
  dispatch({ type: 'live' });
  Utils.logger.info('meeting started');

  if (local.video) {
    const track = local.video.stream.getVideoTracks()[0];
    track.onended = () => {
      dispatch(releaseLocalVideo());
    };
    Utils.logger.info('video track', track);
    const params = { track, appData: { kind: 'video' } };
    const producer = await transports.producer.produce(params);
    dispatch({ type: 'local-video', data: { stream: local.video.stream, producer } });
  }

  if (local.audio) {
    const track = local.audio.stream.getAudioTracks()[0];
    track.onended = () => {
      dispatch(releaseLocalAudio());
    };
    Utils.logger.info('audio track', track);
    const params = { track, appData: { kind: 'audio' } };
    const producer = await transports.producer.produce(params);
    dispatch({ type: 'local-audio', data: { stream: local.audio.stream, producer } });
  }

  if (producers) {
    for (const producer of producers) {
      Utils.logger.info('new producer', producer);
      const params = await Utils.socket.request('consume', {
        producerId: producer.id,
        uuid,
        rtpCapabilities: device.rtpCapabilities,
        key,
      });
      const consumer = await transports.consumer.consume(params);
      const stream = new MediaStream();
      stream.addTrack(consumer.track);
      await Utils.socket.request('resume', { consumerId: consumer.id, key });

      dispatch({
        type: 'new-producer',
        producer,
        consumer,
        stream,
      });
    }
  }
};

export default joinMeeting;
