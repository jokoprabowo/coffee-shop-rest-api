export interface RefreshToken {
  user_id: number;
  selector: string;
  token: string;
  device_info?: string;
  ip_address?: string;
  expires_at: Date;
}
