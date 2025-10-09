export interface CartItemDTO {
  cart_item_id: string|number,
  coffee_id: number,
  name: string,
  price: number,
  quantity: number,
  total_price: number,
  created_at?: string,
  updated_at?: string,
};