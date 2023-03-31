import Utils from './src/utils';
import Mediasoup from './src/mediasoup';
import HTTPServer from './src/http-server';
import SocketIO from './src/socket.io';
import config from './config';

Utils.logger.info(`argan v${config.version} - honeyside ${new Date().getFullYear()}`);

const init = async () => {
  await config.check();
  await HTTPServer.init();
  await SocketIO.init({
    httpServer: HTTPServer.server,
  });
  await Mediasoup.init();
};

init().then(() => {
  Utils.logger.info('init complete');
});
