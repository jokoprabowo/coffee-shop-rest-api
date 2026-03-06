export function mapTransactionStatus(
  transaction_status: string,
  fraud_status?: string
): string {
  switch (transaction_status) {
    case 'capture':
      if (fraud_status === 'challenge') return 'challenge';
      return 'paid';

    case 'settlement':
      return 'paid';

    case 'pending':
      return 'pending';

    case 'deny':
      return 'failed';

    case 'cancel':
      return 'canceled';

    case 'expire':
      return 'expired';

    case 'refund':
      return 'refunded';

    case 'partial_refund':
      return 'partially_refunded';

    default:
      return 'unknown';
  }
}
