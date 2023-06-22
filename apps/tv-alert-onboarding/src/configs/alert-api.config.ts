import { registerAs } from '@nestjs/config';

export default registerAs('alertApiConfig', () => ({
  username: '-',
  password: '-',
  timeout: process.env.ALERT_API_TIMEOUT || 5000,
  url:
    process.env.ALERT_API ||
    'https://eu-central-1.aws.data.mongodb-api.com/app/data-lsbmb/endpoint/get_signal_summary',
}));
