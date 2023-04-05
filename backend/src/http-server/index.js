import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import config from '../../config';
import Utils from '../utils';

const app = express();
const server = createServer(app);

const init = () => {
  app.use(cors());
  app.use(express.static('../frontend/build'));
  app.use('/.well-known', express.static('./src/assets'));
  app.use('/meeting', express.static('../frontend/build'));
  app.use('/join', express.static('../frontend/build'));
  app.use('*', express.static('../frontend/build'));
  server.listen(config.port, () => {
    Utils.logger.info(`http server listening on port ${config.port}`);
  });
};

const HTTPServer = {
  init,
  app,
  server,
};

export default HTTPServer;
