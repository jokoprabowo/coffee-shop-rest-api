enum userRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export interface userDto {
  email: string,
  password: string,
  fullname: string,
  address: string,
  phone: string,
  role: userRole,
}

export interface loginUserDto {
  email: string,
  password: string,
}
