import dotenv from 'dotenv';
import * as Yup from 'yup';
import Utils from './src/utils';

dotenv.config();

const object = {
  // version
  version: '1.0.0',
  build: 1,

  // dotenv
  port: parseInt(process.env.PORT || '80', 10),
  ipAddress: {
    ip: process.env.MAPPED_IP === 'true' ? '0.0.0.0' : process.env.PUBLIC_IP_ADDRESS,
    announcedIp: process.env.MAPPED_IP === 'true' ? process.env.PUBLIC_IP_ADDRESS : null,
  },

  // hardcoded
  mediaCodecs: [
    {
      kind: 'audio',
      mimeType: 'audio/opus',
      clockRate: 48000,
      channels: 2,
    },
    {
      kind: 'video',
      mimeType: 'video/VP8',
      clockRate: 90000,
      parameters: { 'x-google-start-bitrate': 1000 },
    },
  ],
  rtcMinPort:  parseInt(process.env.RTC_MIN_PORT || '10000', 10),
  rtcMaxPort:  parseInt(process.env.RTC_MAX_PORT || '12000', 10),
  mediasoupLogLevel: 'warn',
};

const configSchema = Yup.object({
  PORT: Yup.string().required(),
  PUBLIC_IP_ADDRESS: Yup.string().required(),
  MAPPED_IP: Yup.string().required().oneOf(['true', 'false']),
});

const check = async () => {
  try {
    await configSchema.validate(process.env);
  } catch (e) {
    Utils.logger.warn('environment config error');
    Utils.logger.info(e.errors.join(', '));
    process.exit(0);
  }
};

const config = { ...object, check };

export default config;
