import { registerGlobals } from 'react-native-webrtc';
import * as mediasoup from 'mediasoup-client';
import Utils from '../../utils';
import store from '../../store';

const canProduce = async (type) => {
  try {
    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter(
      (device) => device.kind && device.kind.startsWith(type) && device.kind.endsWith('input'),
    );
    Utils.logger.info(`${type} devices: ${devices.map((device) => device.label).join(', ')}`);
    return devices.length > 0;
  } catch (e) {
    Utils.logger.error('can not enumerate devices');
    return false;
  }
};

const setupMedia = () => async (dispatch) => {
  registerGlobals();

  const device = new mediasoup.Device();
  const rtpCapabilities = await Utils.socket.request('getRouterRtpCapabilities');
  rtpCapabilities.headerExtensions = rtpCapabilities.headerExtensions.filter(
    (ext) => ext.uri !== 'urn:3gpp:video-orientation',
  );
  await device.load({ routerRtpCapabilities: rtpCapabilities });

  navigator.mediaDevices.ondevicechange = async () => {
    dispatch({
      type: 'devices',
      video: await canProduce('video'),
      audio: await canProduce('audio'),
    });
  };

  dispatch({
    type: 'device-ready',
    device,
    video: await canProduce('video'),
    audio: await canProduce('audio'),
  });

  Utils.logger.info('mediasoup device ready');

  const { uuid } = store.getState().media;

  const producerTransportParams = await Utils.socket.request('createProducerTransport', { uuid });

  Utils.logger.info('producerTransportParams', producerTransportParams);

  const producerTransport = device.createSendTransport(producerTransportParams);

  Utils.logger.info('producer transport created');

  producerTransport.on('connect', async ({ dtlsParameters }, callback, error) => {
    Utils.logger.info('connecting producer', dtlsParameters, uuid);
    try {
      await Utils.socket.request('connectProducerTransport', { dtlsParameters, uuid });
      callback();
    } catch (e) {
      error();
    }
  });

  producerTransport.on('connectionstatechange', (state) => {
    switch (state) {
      case 'connecting':
        Utils.logger.info('producer transport connecting');
        break;
      case 'connected':
        Utils.logger.info('producer transport connected');
        break;
      case 'failed':
        Utils.logger.info('producer transport failed');
        producerTransport.close();
        break;
      default:
        Utils.logger.info(`producer transport ${state}`);
        break;
    }
  });

  producerTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, error) => {
    const { name, email } = store.getState().user;
    const { key } = store.getState().meeting;
    try {
      const { id } = await Utils.socket.request('produce', {
        kind,
        rtpParameters,
        uuid,
        name,
        email,
        appData,
        key,
      });
      Utils.logger.info(`producing ${kind}`);
      callback({ id });
    } catch (e) {
      error();
    }
  });

  const consumerTransportParams = await Utils.socket.request('createConsumerTransport', { uuid });

  Utils.logger.info('consumerTransportParams', consumerTransportParams);

  const consumerTransport = device.createRecvTransport(consumerTransportParams);

  Utils.logger.info('consumer transport created');

  consumerTransport.on('connect', async ({ dtlsParameters }, callback, error) => {
    Utils.logger.info('connecting consumer');
    try {
      await Utils.socket.request('connectConsumerTransport', { dtlsParameters, uuid });
      callback();
    } catch (e) {
      error();
    }
  });

  consumerTransport.on('connectionstatechange', (state) => {
    switch (state) {
      case 'connecting':
        Utils.logger.info('consumer transport connecting');
        break;
      case 'connected':
        Utils.logger.info('consumer transport connected');
        break;
      case 'failed':
        Utils.logger.info('consumer transport failed');
        consumerTransport.close();
        break;
      default:
        Utils.logger.info(`consumer transport ${state}`);
        break;
    }
  });

  dispatch({ type: 'transports', data: { producerTransport, consumerTransport } });
};

export default setupMedia;
