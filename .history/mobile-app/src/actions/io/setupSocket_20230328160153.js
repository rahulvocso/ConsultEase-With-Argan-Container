import io from 'socket.io-client';
import Utils from '../../utils';
import config from '../../../config';
import store from '../../store';

const setupSocket = () => (dispatch) => {
  if (!Utils.socket) {
    Utils.socket = io(config.url, { autoConnect: false });

    Utils.socket.request = (type, data = {}) => {
      return new Promise((resolve) => {
        Utils.socket.emit(type, data, resolve);
      });
    };

    Utils.socket.on('welcome', (serverSocketId) => {
      if (serverSocketId === Utils.socket.id) {
        Utils.logger.info('socket.io connected', serverSocketId);
        dispatch({ type: 'socket', id: serverSocketId });
        dispatch({ type: 'snack', severity: 'success', content: 'connected to server' });
        const { uuid } = store.getState().media;
        Utils.socket.emit('uuid', uuid);
      } else {
        Utils.logger.error('socket.io ids mismatch', serverSocketId, Utils.socket.id);
        dispatch({ type: 'snack', severity: 'error', content: 'could not connect to server' });
      }
    });

    Utils.socket.on('reload', () => {
      window.location.reload();
    });

    Utils.socket.on('producer', async (data) => {
      Utils.logger.info('new producer', data);
      const { device, transports, uuid } = store.getState().media;
      const { key } = store.getState().meeting;
      const params = await Utils.socket.request('consume', {
        producerId: data.id,
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
        producer: data,
        consumer,
        stream,
      });
    });

    Utils.socket.on('message', (data) => {
      const { uuid } = store.getState().media;
      if (uuid !== data.uuid) {
        Utils.logger.info('message', data);
        dispatch({
          type: 'message',
          message: data,
        });
      }
    });

    Utils.socket.on('producer-close', async (data) => {
      dispatch({
        type: 'producer-close',
        uuid: data.uuid,
        kind: data.kind,
      });
    });

    Utils.socket.on('peers', async (data) => {
      dispatch({ type: 'peers', peers: data.peers });
    });

    Utils.socket.on('connect_error', (e) => {
      Utils.logger.error('socket.io could not connect to server', e);
      dispatch({ type: 'snack', severity: 'error', content: 'could not connect to server' });
    });

    Utils.socket.connect();
  }
  console.log('socket connected status', socket.connected);
};

export default setupSocket;
