function pathResponse(desc: string, status: string, exampleMsg: string, data?: object) {
  const properties: Record<string, object> = {
    status: { type: 'string', example: status },
    message: { type: 'string', example: exampleMsg },
  };

  if (data) {
    properties.data = { type: 'object', properties: data };
  }

  return {
    description: desc,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties,
        },
      },
    },
  };
};

export const paths = {
  '/api/v1/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register new user account',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User registration request' },
          },
        },
      },
      responses: {
        201: pathResponse( 'Successfully register new user account', 'CREATED', 'Account successfully created! Please verify your email to activate your account.',
          { user: { $ref: '#/components/schemas/User model' } },
        ),
        400: pathResponse( 'Invalid register input', 'BAD_REQUEST', 'Invalid input!' ),
        403: pathResponse( 'Unauthorized admin register attempt', 'FORBIDDEN', 'You are not allowed to register as an admin!' ),
        409: pathResponse( 'Email already registered', 'CONFLICT_ERROR', 'Email already in use!' ),
      },
    },
  },
  '/api/v1/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login into user account',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User login request' },
          },
        },
      },
      responses: {
        200: pathResponse( 'Successfully login into user account', 'OK', 'User login successfully',
          {
            user: { $ref: '#/components/schemas/User model' },
            accessToken: { type: 'string', example: 'eqwkhbu283igsiug921giwge19whve2y1.hjdgas71fuawsyfd1' },
          }),
        400: pathResponse( 'Invalid login input', 'BAD-REQUEST', 'Invalid input!' ),
        403: pathResponse( 'Email not verified', 'FORBIDDEN', 'Email is not verified! A new verification email has been sent to your email address.' ),
        404: pathResponse( 'User not found', 'NOT_FOUND', 'User not found!' ),
      },
    },
  },
  '/api/v1/auth/refresh-token': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                deviceInfo: { type: 'string', example: 'Raspberry 10 pro' }, 
                ipAddress: { type: 'string', example: '192.168.1.1' },
              },
            },
          },
        },
      },
      responses: {
        200: pathResponse('Successfully refresh the access token', 'OK', 'Access token refreshed!',
          { accessToken: { type: 'string', example: 'eqwkhbu283igsiug921giwge19whve2y1.hjdgas71fuawsyfd1' } }
        ),
        400: pathResponse( 'Invalid refresh token', 'BAD_REQUEST', 'Invalid refresh token!' ),
        403: pathResponse( 'Reuse revoked refresh token', 'FORBIDDEN', 'Refresh token has been revoked. Please login again!' ),
      },
    },
  },
  '/api/v1/auth/verify': {
    get: {
      tags: ['Auth'],
      summary: 'Verify user account',
      parameters: [{
        name: 'token', in: 'query', required: true, description: 'Verification token',
        schema: { type: 'string', example: '4c5c5eebc4cc7bef1bd22ebb64c6a8297381523ebd9c3ec2c556d64899c82649' },
      }],
      responses: {
        200: pathResponse('Successfully verify user account', 'OK', 'Email successfully verified!'),
        400: pathResponse('Invalid or expired verification token', 'BAD_REQUEST', 'Invalid or expired token'),
      },
    },
  },
  '/api/v1/auth/forgot-password': {
    post: {
      tags: ['Auth'],
      summary: 'Request password reset',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'example@email.com' }, 
              },
            },
          },
        },
      },
      responses: {
        200: pathResponse('Successfully request password reset', 'OK', 'Password reset link sent to your email!'),
        404: pathResponse('User not found', 'NOT_FOUND', 'User not found!'),
      },
    },
  },
  '/api/v1/auth/reset-password': {
    put: {
      tags: ['Auth'],
      summary: 'Reset user password',
      parameters: [{
        name: 'token', in: 'query', required: true, description: 'Password reset token',
        schema: { type: 'string', example: '4c5c5eebc4cc7bef1bd22ebb64c6a8297381523ebd9c3ec2c556d64899c82649' },
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                newPassword: { type: 'string', example: 'Example!pass123' }, 
              },
            },
          },
        },
      },
      responses: {
        200: pathResponse('Successfully reset user password', 'OK', 'Password successfully reset!'),
        400: pathResponse('Invalid or expired verification token', 'BAD_REQUEST', 'Invalid or expired token'),
      },
    },
  },
  '/api/v1/auth/logout': {
    delete: {
      tags: ['Auth'],
      summary: 'Logout from user account',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse( 'Successfully logout from user account', 'OK', 'User logged out successfully!' ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
      },
    },
  },
  '/api/v1/users/all': {
    get: {
      tags: ['Users', 'Admin'],
      summary: 'Get all users',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse( 'Successfully get all users', 'OK', 'Users data have been retrieved!',
          { users: { type: 'array', items: { $ref: '#/components/schemas/User model' } } }
        ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        403: pathResponse( 'Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!' ),
      },
    },
  },
  '/api/v1/users/profile': {
    get: {
      tags: ['Users'],
      summary: 'Get user details',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse( 'Successfully get user details', 'OK', 'User details have been retrieved!',
          { user: { $ref: '#/components/schemas/User model' } }
        ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        404: pathResponse( 'User not found', 'NOT_FOUND', 'User not found!' ),
      },
    },
  },
  '/api/v1/users/update': {
    put: {
      tags: ['Users'],
      summary: 'Update user details',
      security: [{ barerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User update request' },
          },
        },
      },
      responses: {
        200: pathResponse( 'Successfully update user details', 'OK', 'User details have been updated!', 
          { user: { $ref: '#/components/schemas/User model' } }
        ),
        400: pathResponse( 'Invalid update input', 'BAD_REQUEST', 'Invalid input!' ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        404: pathResponse( 'User not found', 'NOT_FOUND', 'User not found!' ),
      },
    },
  },
  'api/v1/users/delete': {
    delete: {
      tags: ['Users'],
      summary: 'Delete user account',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse( 'Successfully delete user', 'OK', 'User has been deleted!' ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        404: pathResponse( 'User not found', 'NOT_FOUND', 'User not found!' ),
      },
    },
  },
  '/api/v1/coffees': {
    post: {
      tags: ['Coffees', 'Admin'],
      summary: 'Create new coffee',
      security: [{ barerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Coffee model' },
          },
        },
      },
      responses: {
        201: pathResponse( 'Successfully create new coffee', 'CREATED', 'Coffee has been created!',
          { coffee: { $ref: '#/components/schemas/Coffee model' } }
        ),
        400: pathResponse( 'Invalid coffee input data', 'BAD_REQUEST', 'Invalid input!' ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        403: pathResponse( 'Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!' ),
        409: pathResponse( 'Coffee already exists', 'CONFLICT_ERROR', 'Coffee already exists!' ),
      },
    },
    get: {
      tags: ['Coffees'],
      summary: 'Get all coffees',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse( 'Successfully get all coffees', 'OK', 'Coffees have been retrieved!',
          { coffees: { type: 'array', items: { $ref: '#/components/schemas/Coffee model' } } }
        ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
      },
    },
  },
  '/api/v1/coffees/most-favorite': {
    get: {
      tags: ['Coffees', 'Admin'],
      summary: 'Get most favorite coffees',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse('Successfully get most favorite coffees', 'OK', 'Most favorite coffees have been retrieved!',
          { coffees: { type: 'array', items: { name: { type: 'string', description: 'The coffee name', example: 'Americano' },
            total_ordered: { type: 'integer', description: 'Total ordered quantity of the coffee', example: 100 } } } }
        ),
        403: pathResponse('Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!'),
      },
    },
  },
  '/api/v1/coffees/{id}': {
    get: {
      tags: ['Coffees'],
      summary: 'Get coffee details',
      security: [{ barerAuth: [] }],
      parameters: [{
        name: 'id', in: 'path', required: true, description: 'Coffee id', schema: { type: 'integer', example: 1 },
      }],
      responses: {
        200: pathResponse( 'Successfully get coffee details', 'OK', 'Coffee has been retrieved!',
          { coffees: { $ref: '#/components/schemas/Coffee model' } }
        ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        404: pathResponse( 'Coffee not found', 'NOT_FOUND', 'Coffee not found!' ),
      },
    },
    put: {
      tags: ['Coffees', 'Admin'],
      summary: 'Update coffee',
      security: [{ barerAuth: [] }],
      parameters: [{
        name: 'id', in: 'path', required: true, description: 'Coffee id', schema: { type: 'integer', example: 1 },
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Coffee model' },
          },
        },
      },
      responses: {
        200: pathResponse( 'Successfully update coffee data', 'OK', 'Coffee has been updated!',
          { coffees: { $ref: '#/components/schemas/Coffee model' } }
        ),
        400: pathResponse( 'Invalid coffee input data', 'BAD_REQUEST', 'Invalid input!' ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        403: pathResponse( 'Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!' ),
        404: pathResponse( 'Coffee not found', 'NOT_FOUND', 'Coffee not found!' ),
      },
    },
    delete: {
      tags: ['Coffees', 'Admin'],
      summary: 'Delete coffee',
      security: [{ barerAuth: [] }],
      parameters: [{
        name: 'id', in: 'path', required: true, description: 'Coffee id', schema: { type: 'integer', example: 1 },
      }],
      responses: {
        200: pathResponse( 'Successfully delete coffee data', 'OK', 'Coffee has been deleted!' ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        403: pathResponse( 'Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!' ),
        404: pathResponse( 'Coffee not found', 'NOT_FOUND', 'Coffee not found!' ),
      },
    },
  },
  '/api/v1/carts': {
    post: {
      tags: ['Carts'],
      summary: 'Add coffee to cart',
      security: [{ barerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                coffee_id: { type: 'integer', example: 1 },
                quantity: { type: 'integer', example: 1 },
              },
            },
          },
        },
      },
      responses: {
        201: pathResponse( 'Successfully add coffee to cart', 'CREATED', 'Coffee has been added to cart!', 
          { cartItems : { type: 'array', items: { $ref: '#/components/schemas/Cart item model' } } }
        ),
        400: pathResponse('Invalid cart item input data', 'BAD_REQUEST', 'Invalid input!'),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
      },
    },
    get: {
      tags: ['Carts'],
      summary: 'Get cart items',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse( 'Successfully get cart items', 'OK', 'Cart items have been retrieved!',
          { cartItems : { type: 'array', items: { $ref: '#/components/schemas/Cart item model' } } }
        ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
      },
    },
    put: {
      tags: ['Carts'],
      summary: 'Update cart item',
      security: [{ barerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                cart_item_id: { oneOf: [
                  { type: 'integer', example: 1 },
                  { type: 'string', example: '4c5c5eebc4cc7bef1bd22ebb64c6a8297381523ebd9c3ec2c556d64899c82649' },
                ] },
                quantity: { type: 'integer', example: 1 },
              },
            },
          },
        },
      },
      responses: {
        200: pathResponse( 'Successfully update cart item', 'OK', 'Cart item has been updated!',
          { cartItems : { type: 'array', items: { $ref: '#/components/schemas/Cart item model' } } }
        ),
        400: pathResponse('Invalid cart item input data', 'BAD_REQUEST', 'Invalid input!'),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        404: pathResponse( 'Cart item not found', 'NOT_FOUND', 'Cart item not found!' ),
      },
    },
    delete: {
      tags: ['Carts'],
      summary: 'Delete cart item',
      security: [{ barerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                cart_item_id: { oneOf: [
                  { type: 'integer', example: 1 },
                  { type: 'string', example: '4c5c5eebc4cc7bef1bd22ebb64c6a8297381523ebd9c3ec2c556d64899c82649' },
                ] },
              },
            },
          },
        },
      },
      responses: {
        200: pathResponse( 'Successfully delete cart item', 'OK', 'Cart item has been deleted!' ),
        400: pathResponse('Invalid cart item input data', 'BAD_REQUEST', 'Invalid input!'),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        404: pathResponse( 'Cart item not found', 'NOT_FOUND', 'Cart item not found!' ),
      },
    },
  },
  '/api/v1/orders': {
    post: {
      tags: ['Orders'],
      summary: 'Create new order from cart',
      security: [{ barerAuth: [] }],
      responses: {
        201: pathResponse( 'Successfully create new order', 'CREATED', 'Order has been created!',
          { order: { $ref: '#/components/schemas/Order model' } }
        ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        404: pathResponse( 'There is no item on cart', 'NOT_FOUND', 'Cart is empty!' ),
      },
    },
    get: {
      tags: ['Orders'],
      summary: 'Get user order histories',
      security: [{ barerAuth: [] }],
      responses: {
        200: pathResponse( 'Successfully get user order histories', 'OK', 'Orders have been retrieved!',
          { order: { type: 'array', items: { $ref: '#/components/schemas/Order model' } } }
        ),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
      },
    },
  },
  '/api/v1/orders/stats': {
    get: {
      tags: ['Orders', 'Admin'],
      summary: 'Get list of total ordered and total revenue per day in a month',
      security: [{ bearerAuth: [] }],
      parameters: [{
        name: 'month', in: 'query', required: true, description: 'The month of requested data', schema: { type: 'integer', example: 1 },
      }, {
        name: 'year', in: 'query', required: true, description: 'The year of requested data', schema: { type: 'integer', example: 2026 },
      },  {
        name: 'statuses', in: 'query', required: true, description: 'The status of requested data', schema: { type: 'string', example: 'paid,settlement' },
      }],
      responses: {
        200: pathResponse('Successfully get monthly order stats data', 'OK', 'Monthly order stats have been retrieved!', {
          orderStats: { type: 'array', items: {
            date: { type: 'string', description: 'Date of the data', example: '2026-01-01T00:00:00' },
            totalOrder: { type: 'integer', description: 'Total order data', example: 10 },
            totalRevenue: { type: 'integer', description: 'Total ordered coffee', example: 100 }
          } },
        }),
        400: pathResponse('Invalid order input data', 'BAD_REQUEST', 'Invalid input!'),
        403: pathResponse('Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!'),
      },    
    },
  },
  '/api/v1/orders/{id}': {
    get: {
      tags: ['Orders'],
      summary: 'Get order details',
      security: [{ barerAuth: [] }],
      parameters: [{
        name: 'id', in: 'path', required: true, description: 'Order id', schema: { type: 'integer', example: 1 },
      }],
      responses: {
        200: pathResponse( 'Successfully get user order details', 'OK', 'Order has been retrieved!',
          { order: { $ref: '#/components/schemas/Order model' } }
        ),
        400: pathResponse('Invalid order input data', 'BAD_REQUEST', 'Invalid input!'),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        403: pathResponse('Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!'),
        404: pathResponse( 'Order not found', 'NOT_FOUND', 'Order not found!' ),
      },
    },
    put: {
      tags: ['Orders'],
      summary: 'Update order status',
      security: [{ barerAuth: [] }],
      parameters: [{
        name: 'id', in: 'path', required: true, description: 'Order id', schema: { type: 'integer', example: 1 },
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'paid' },
              },
            },
          },
        },
      },
      responses: {
        200: pathResponse( 'Successfully update user order', 'OK', 'Order has been updated!' ),
        400: pathResponse('Invalid order input data', 'BAD_REQUEST', 'Invalid input!'),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        403: pathResponse('Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!'),
        404: pathResponse( 'Order not found', 'NOT_FOUND', 'Order not found!' ),
      },
    },
    delete: {
      tags: ['Orders'],
      summary: 'Delete order',
      security: [{ barerAuth: [] }],
      parameters: [{
        name: 'id', in: 'path', required: true, description: 'Order id', schema: { type: 'integer', example: 1 },
      }],
      responses: {
        200: pathResponse( 'Successfully delete user order', 'OK', 'Order has been deleted!' ),
        400: pathResponse('Invalid order input data', 'BAD_REQUEST', 'Invalid input!'),
        401: pathResponse( 'Unauthenticated, login required!', 'UNAUTHENTICATED', 'Access token is missing!' ),
        403: pathResponse('Unauthorized access', 'FORBIDDEN', 'You do not have permission to access this resource!'),
        404: pathResponse( 'Order not found', 'NOT_FOUND', 'Order not found!' ),
      },
    },
  },
  '/api/v1/payments/webhook': {
    post: {
      tags: ['Payments'],
      summary: 'Webhook for payment gateway',
      response: {
        201: pathResponse('Successfully create payment event', 'CREATED', 'Transaction has been created!'),
      },
    },
  },
};