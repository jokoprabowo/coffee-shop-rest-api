export interface PaymentDTO {
  id: number,
  order_id: number,
  provider: string,
  payment_type: string,
  transaction_id: string,
  transaction_status: string,
  amount: number,
  created_at?: string,
}

export interface PaymentEventDTO {
  id: number,
  payment_id: number,
  event_type: string,
  payload_hash: string,
  created_at?: string,
}
