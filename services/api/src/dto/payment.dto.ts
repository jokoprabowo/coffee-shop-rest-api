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
  order_id: number,
  transaction_id: string,
  transaction_status: string,
  payload_hash: number,
  created_at?: string,
}
