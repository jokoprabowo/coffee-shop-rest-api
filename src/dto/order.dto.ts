export interface OrderDTO {
  id: number,
  user_id: number,
  status: string,
  total: number,
  total_price?: number,
}

export interface OrderItemDTO {
  id: number,
  order_id: number,
  coffee_id: number,
  name: string,
  quantity: number,
  unit_price: number,
  total_price: number,
}