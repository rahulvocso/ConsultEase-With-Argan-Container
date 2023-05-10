import xss from 'xss';
import Utils from '../utils';

const messageDirectPrivate = async ({ messageData }) => {
  Utils.logger.info(JSON.stringify(data));
  Utils.io.to(messageData.to).emit('messageDirectPrivate', {
    // uuid: data.uuid,
    content: xss(messageData),
    // name: xss(data.name),
    // email: xss(data.email),
  });
  console.log(`Message sent to device with socket ID ${messageData.to}: ${messageData}`);
};

export default messageDirectPrivate;
