import xss from 'xss';
import Utils from '../utils';

const messageDirectPrivate = async ({ data, callback }) => {
  Utils.logger.info(JSON.stringify(data));
  Utils.io.to(data.to).emit('messageDirectPrivate', {content: xss(data)});
  console.log(`Message data sent to device with socket ID ${data.to}: ${data}`);
};

export default messageDirectPrivate;
