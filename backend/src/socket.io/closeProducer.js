import Utils from '../utils';
import Mediasoup from '../mediasoup';

const closeProducer = async ({ data, callback }) => {
  Utils.io.emit('producer-close', data);

  if (!Mediasoup.activeProducers[data.key]) {
    Mediasoup.activeProducers[data.key] = [];
  }

  const removeProducer = (id) => {
    const index = Mediasoup.activeProducers[data.key].findIndex((e) => e.id === id);
    if (index !== -1) {
      Mediasoup.activeProducers[data.key].splice(index, 1);
    }
  };

  removeProducer(data.id);
  callback();
};

export default closeProducer;
