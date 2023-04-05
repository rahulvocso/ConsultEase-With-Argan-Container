import xss from 'xss';
import Utils from '../utils';

const message = async ({ data, callback }) => {
  Utils.logger.info(JSON.stringify(data));
  Utils.io.to(data.key).emit('message', {
    uuid: data.uuid,
    content: xss(data.content),
    name: xss(data.name),
    email: xss(data.email),
  });
  callback();
};

export default message;
