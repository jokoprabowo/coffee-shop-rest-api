export interface RefreshToken {
  user_id: number;
  token: string;
  device_info?: string;
  ip_address?: string;
  expires_at: Date;
}
