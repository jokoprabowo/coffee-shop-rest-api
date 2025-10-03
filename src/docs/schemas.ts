export const schemas = {
  'User model': {
    type: 'object',
    required: ['fullname', 'address', 'phone', 'email', 'password'],
    properties: {
      fullname: { type: 'string', description: 'User\'s fullname', example: 'Joko Prabowo' },
      address: { type: 'string', description: 'User\'s address', example: 'Jl. Kemerdekaan, Perumahan Sastra Asri, Blok A2/12' },
      phone: { type: 'string', description: 'User\'s phone number', example: '08987654321' },
      email: { type: 'string', description: 'User\'s email', example: 'joko@mail.com' },
      password: { type: 'string', description: 'Account\'s password', example: 'example12345' },
      role: { type: 'string', description: 'Account\'s role', enum: ['customer', 'admin'], example: 'customer' },
    },
  },
  'User registration request': {
    type: 'object',
    required: ['fullname', 'address', 'phone', 'email', 'password'],
    properties: {
      fullname: { type: 'string', description: 'User\'s fullname', example: 'Joko Prabowo' },
      address: { type: 'string', description: 'User\'s address', example: 'Jl. Kemerdekaan, Perumahan Sastra Asri, Blok A2/12' },
      phone: { type: 'string', description: 'User\'s phone number', example: '08987654321' },
      email: { type: 'string', description: 'User\'s email', example: 'joko@mail.com' },
      password: { type: 'string', description: 'Account\'s password', example: 'example12345' },
      role: { type: 'string', description: 'Account\'s role', enum: ['customer', 'admin'], example: 'customer' },
      deviceInfo: { type: 'string', descrition: 'Device information', example: 'Raspberry 10 pro' },
      ipAddress: { type: 'string', description: 'User\'s IP address', example: '192.168.1.1' },
    },
  },
  'User login request': {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', description: 'User\'s email', example: 'joko@mail.com' },
      password: { type: 'string', description: 'Account\'s password', example: 'example12345' },
      deviceInfo: { type: 'string', descrition: 'Device information', example: 'Raspberry 10 pro' },
      ipAddress: { type: 'string', description: 'User\'s IP address', example: '192.168.1.1' },
    },
  },
  'User update request': {
    type: 'object',
    properties: {
      fullname: { type: 'string', description: 'User\'s fullname', example: 'Joko Prabowo' },
      address: { type: 'string', description: 'User\'s address', example: 'Jl. Kemerdekaan, Perumahan Sastra Asri, Blok A2/12' },
      phone: { type: 'string', description: 'User\'s phone number', example: '08987654321' },
      email: { type: 'string', description: 'User\'s email', example: 'joko@mail.com' },
      password: { type: 'string', description: 'Account\'s password', example: 'example12345' },
    },
  },
  'Coffee model': {
    type: 'object',
    required: ['name', 'price', 'description', 'image'],
    properties: {
      name: { type: 'string', description: 'The coffee name', example: 'Americano' },
      price: { type: 'string', description: 'The coffee price', example: '15000' },
      description: { type: 'string', description: 'The coffee description', example: 'A black coffee made by diluting espresso with hot water.' },
      image: { type: 'string', description: 'The coffee image URL', example: 'https://example.com/americano.jpg' },
    },
  },
  'Refresh token model': {
    type: 'object',
    required: ['user_id', 'token', 'expires_at'],
    properties: {
      user_id: { type: 'integer', description: 'Id of the user', example: 1 },
      token: { type: 'string', description: 'Refresh token of the user', example: '6983fc59d1d8479b319a729c09b20f0e40aff8ef9d65c920309472266f724ae6' },
      deviceInfo: { type: 'string', descrition: 'Device information', example: 'Raspberry 10 pro' },
      ipAddress: { type: 'string', description: 'User\'s IP address', example: '192.168.1.1' },
      is_revoked:  { type: 'boolean', description: 'Token revocation status', example: false },
      expires_at: { type: 'string', format: 'date-time', description: 'Expiration date of the refresh token', example: '2025-01-28T16:27:58Z' },
    },
  },
  'Cart model': {
    type: 'object',
    required: ['user_id', 'status'],
    properties: {
      user_id: { type: 'integer', description: 'Id of the user', example: 1 },
      status: { type: 'string', description: 'Status of the cart', enum: ['open', 'checked out'], example: 'open' },
    },
  },
  'Cart item model': {
    type: 'object',
    required: ['cart_id', 'coffee_id', 'quantity'],
    properties: {
      cart_id: { type: 'integer', description: 'Id of the cart', example: 1 },
      coffee_id: { type: 'integer', description: 'Id of the coffee', example: 1 },
      quantity: { type: 'integer', description: 'Quantity of the coffee', example: 1 },
    }
  },
  'Cart items response': {
    type: 'object',
    properties: {
      cart_id: { type: 'integer', description: 'Id of the cart', example: 1 },
      cart_item_id: { type: 'integer', description: 'Id of the cart item', example: 1 },
      name: { type: 'string', description: 'The coffee name', example: 'Americano' },
      price: { type: 'integer', description: 'Price of the coffee', example: 12000 },
      quantity: { type: 'integer', description: 'Quantity of the coffee', example: 1 },
      total_price_per_item: { type: 'integer', description: 'Total price of the coffee', example: 12000 },
    },
  },
  'Order model': {
    type: 'object',
    required: ['user_id', 'status', 'total'],
    properties: {
      user_id: { type: 'integer', description: 'Id of the user', example: 1 },
      status: { type: 'string', description: 'Status of the cart', enum: ['unpaid', 'paid', 'cancelled'], example: 'open' },
      total: { type: 'integer', description: 'Total items of the ordered coffees', example: 1 },
    },
  },
  'Order item model': {
    type: 'object',
    required: ['order_id', 'coffee_id', 'quantity', 'unit_price', 'total_price'],
    properties: {
      order_id: { type: 'integer', description: 'Id of the order', example: 1 },
      coffee_id: { type: 'integer', description: 'Id of the coffee', example: 1 },
      quantity: { type: 'integer', description: 'Quantity of the ordered coffee', example: 1 },
      unit_price: { type: 'integer', description: 'Price of the ordered coffee', example: 12000 },
      total_price: { type: 'integer', description: 'Total price of the ordered coffees', example: 12000 },
    },
  },
  'Order details response': {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'The coffee name', example: 'Americano' },
      quantity: { type: 'integer', description: 'Quantity of the ordered coffee', example: 1 },
      unit_price: { type: 'integer', description: 'Price of the ordered coffee', example: 12000 },
      total_price: { type: 'integer', description: 'Total price of the ordered coffees', example: 12000 },
    },
  },
};
