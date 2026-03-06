export interface RefreshTokenDTO {
  user_id: number,
  selector: string,
  token: string,
  device_info?: string,
  ip_address?: string,
  is_revoked?: boolean,
  expires_at: string,
}
