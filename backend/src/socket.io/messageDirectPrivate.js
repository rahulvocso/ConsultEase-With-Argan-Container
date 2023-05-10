import xss from 'xss';
import Utils from '../utils';

const messageDirectPrivate = async ({ data, callback }) => {
  Utils.logger.info(JSON.stringify(data));
  Utils.io.to(data.content.to).emit('messageDirectPrivate', {
    // uuid: data.uuid,
    content: xss(data.content),
    // name: xss(data.name),
    // email: xss(data.email),
  });
  console.log(`Message sent to device with socket ID ${data.content.to}: ${data}`);
};

export default messageDirectPrivate;
