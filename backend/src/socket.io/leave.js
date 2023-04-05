import Mediasoup from '../mediasoup';
import Utils from '../utils';

const leave = async ({ data, callback }) => {
  if (!Mediasoup.peers[data.key]) {
    Mediasoup.peers[data.key] = {};
  }

  delete Mediasoup.peers[data.key][data.uuid];
  Utils.io.to(data.key).emit('peers', {
    peers: Mediasoup.peers[data.key],
  });
  callback({
    peers: Mediasoup.peers[data.key],
  });
};

export default leave;
