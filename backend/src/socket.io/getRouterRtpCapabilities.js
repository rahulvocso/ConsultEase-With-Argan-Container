import Mediasoup from '../mediasoup';

const getRouterRtpCapabilities = ({ callback }) => {
  callback(Mediasoup.getRouter().rtpCapabilities);
};

export default getRouterRtpCapabilities;
