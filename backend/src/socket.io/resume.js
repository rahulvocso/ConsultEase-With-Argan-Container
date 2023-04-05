import Mediasoup from '../mediasoup';

const resume = async ({ data, callback }) => {
  if (!Mediasoup.consumers[data.key]) {
    Mediasoup.consumers[data.key] = {};
  }

  await Mediasoup.consumers[data.key][data.consumerId].resume();
  callback();
};

export default resume;
