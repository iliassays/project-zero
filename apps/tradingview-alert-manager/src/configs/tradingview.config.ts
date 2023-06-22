import { registerAs } from '@nestjs/config';

export default registerAs('tradingviewConfig', () => ({
  username: process.env.tradingview_username || 'uinahidrayhan@gmail.com',
  password: process.env.radingview_password || 'samurai@1',
  url:
    process.env.tradingview_url || 'https://www.tradingview.com/chart/nTr7wxBX',
}));
