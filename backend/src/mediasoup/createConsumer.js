import Utils from '../utils';

const createConsumer = async ({
  router, producer, rtpCapabilities, transport,
}) => {
  if (!producer || !router.canConsume({ producerId: producer.id, rtpCapabilities })) {
    Utils.logger.error('can not consume');
    return {};
  }
  let consumer;
  try {
    consumer = await transport.consume({
      producerId: producer.id,
      rtpCapabilities,
      paused: producer.kind === 'video',
    });
  } catch (error) {
    Utils.logger.error('consume failed', error);
    return {};
  }

  if (consumer.type === 'simulcast') {
    await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
  }

  return {
    consumer,
    response: {
      producerId: producer.id,
      id: consumer.id,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
    },
  };
};

export default createConsumer;
