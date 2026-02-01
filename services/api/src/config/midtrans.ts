import midtransClient from 'midtrans-client';
import config from '.';

export const midtransSnap = new midtransClient.Snap({
  isProduction: config.NODE_ENV === 'production',
  serverKey: config.SERVER_KEY!,
  clientKey: config.CLIENT_KEY!,
});
