import crypto from 'node:crypto';

interface MidtransPayload {
  order_id: 'string',
  status_code: 'string',
  gross_amount: 'string',
  signature_key: 'string',
}

export function verifyMidtransSignature(payload: MidtransPayload, serverKey: string) {
  const { order_id, status_code, gross_amount, signature_key } = payload;

  const hash = crypto
    .createHash('sha512')
    .update(order_id + status_code + gross_amount + serverKey)
    .digest('hex');

  return hash === signature_key;
}
