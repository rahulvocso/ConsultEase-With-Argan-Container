import config from '../../config';

const createWebRtcTransport = async ({ router }) => {
  const transport = await router.createWebRtcTransport({
    listenIps: [config.ipAddress],
    enableUdp: true,
    enableTcp: true,
    preferUdp: false,
    initialAvailableOutgoingBitrate: 1000000,
  });
  await transport.setMaxIncomingBitrate(1500000);
  return {
    transport,
    params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    },
  };
};

export default createWebRtcTransport;
