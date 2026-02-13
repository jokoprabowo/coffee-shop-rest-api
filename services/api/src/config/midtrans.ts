import midtransClient from 'midtrans-client';
import config from '.';

const isProduction = config.NODE_ENV === 'production';

export const midtransSnap = new midtransClient.Snap({
  isProduction,
  serverKey: config.SERVER_KEY!,
  clientKey: config.CLIENT_KEY!,
});
