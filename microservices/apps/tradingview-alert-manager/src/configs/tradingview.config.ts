import { registerAs } from '@nestjs/config';

export default registerAs('tradingviewConfig', () => ({
  username: process.env.tradingview_username,
  password: process.env.radingview_password,
  url:
    process.env.tradingview_url ||
    'https://www.tradingview.com/chart/nTr7wxBX/',
}));
