export enum userRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export interface UserDto {
  email: string,
  password: string,
  fullname: string,
  address: string,
  phone: string,
  role?: userRole
}

export interface LoginUserDto {
  email: string,
  password: string,
}
