import xss from 'xss';
import Utils from '../utils';

const messageDirectPrivate = async ({ data, callback } ) => {
  Utils.logger.info(JSON.stringify(data));
  // Utils.io.to(data.to).emit('messageDirectPrivate', {
  //   // uuid: data.uuid,
  //   content: xss(data),
  //   // name: xss(data.name),
  //   // email: xss(data.email),
  // });
  console.log(`Message ${JSON.parse(data)} ${data} sent to device with socket ID`);// ${data.to}: ${data}`);
};

export default messageDirectPrivate;
