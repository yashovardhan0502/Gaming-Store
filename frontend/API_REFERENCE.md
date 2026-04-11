# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "token": "jwt_token_here"
}

Errors:
- 400: User already registered
```

### Login User
```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "token": "jwt_token_here"
}

Errors:
- 400: Invalid Credentials
```

## Game Endpoints

### Get All Games (Public)
```http
GET /games

Response (200):
[
  {
    "_id": "game_id",
    "title": "Game Title",
    "price": 59.99,
    "platform": "PC",
    "genre": "Action",
    "stock": 100,
    "image": "https://example.com/image.jpg"
  }
]
```

### Get Game by ID (Public)
```http
GET /games/:id

Response (200):
{
  "_id": "game_id",
  "title": "Game Title",
  "price": 59.99,
  "platform": "PC",
  "genre": "Action",
  "stock": 100,
  "image": "https://example.com/image.jpg"
}

Errors:
- 400: Game Not Found
```

### Add New Game (Admin Only) 🔒
```http
POST /games
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "New Game",
  "price": 59.99,
  "platform": "PS5",
  "genre": "RPG",
  "stock": 50,
  "image": "https://example.com/image.jpg"
}

Response (201):
{
  "_id": "game_id",
  "title": "New Game",
  "price": 59.99,
  "platform": "PS5",
  "genre": "RPG",
  "stock": 50,
  "image": "https://example.com/image.jpg"
}

Errors:
- 401: Not authorized, no token
- 403: Admin access only!
```

### Update Game (Admin Only) 🔒
```http
PUT /games/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body (all fields optional):
{
  "title": "Updated Title",
  "price": 49.99,
  "platform": "PC",
  "genre": "Action",
  "stock": 75,
  "image": "https://example.com/new-image.jpg"
}

Response (200):
{
  "_id": "game_id",
  "title": "Updated Title",
  "price": 49.99,
  ...
}

Errors:
- 400: Game Not Found
- 401: Not authorized, no token
- 403: Admin access only!
```

### Delete Game (Admin Only) 🔒
```http
DELETE /games/:id
Authorization: Bearer <token>

Response (200):
{
  "message": "Game removed!"
}

Errors:
- 400: Game Not Found
- 401: Not authorized, no token
- 403: Admin access only!
```

## Order Endpoints

### Place Order (Protected) 🔒
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "items": [
    {
      "game": "game_id_1",
      "quantity": 2
    },
    {
      "game": "game_id_2",
      "quantity": 1
    }
  ],
  "totalAmount": 119.98
}

Response (201):
{
  "_id": "order_id",
  "user": "user_id",
  "items": [...],
  "totalAmount": 119.98,
  "status": "Pending",
  "createdAt": "2025-01-29T...",
  "updatedAt": "2025-01-29T..."
}

Errors:
- 400: No order items to place!
- 400: Not enough stock for {game.title}
- 401: Not authorized, no token
- 404: Game Not Found!
- 500: Internal Server Error
```

### Get My Orders (Protected) 🔒
```http
GET /orders/my
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "game": {
          "_id": "game_id",
          "title": "Game Title",
          "price": 59.99,
          "image": "..."
        },
        "quantity": 2
      }
    ],
    "totalAmount": 119.98,
    "status": "Pending",
    "createdAt": "2025-01-29T...",
    "updatedAt": "2025-01-29T..."
  }
]

Errors:
- 401: Not authorized, no token
- 404: Orders not found!
```

### Get All Orders (Admin Only) 🔒
```http
GET /orders
Authorization: Bearer <token>

Response (200):
[
  {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [...],
    "totalAmount": 119.98,
    "status": "Processing",
    "createdAt": "2025-01-29T...",
    "updatedAt": "2025-01-29T..."
  }
]

Errors:
- 401: Not authorized, no token
- 403: Admin access only!
```

### Update Order Status (Admin Only) 🔒
```http
PUT /orders/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "status": "Shipped"
}

Status Options:
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

Response (200):
{
  "_id": "order_id",
  "user": "user_id",
  "items": [...],
  "totalAmount": 119.98,
  "status": "Shipped",
  "createdAt": "2025-01-29T...",
  "updatedAt": "2025-01-29T..."
}

Errors:
- 401: Not authorized, no token
- 403: Admin access only!
- 404: Order not found
```

## Authentication Headers

### Format
```
Authorization: Bearer <jwt_token>
```

### Example
```javascript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

## Error Response Format

All errors follow this format:
```json
{
  "message": "Error description here"
}
```

## Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get All Games
```bash
curl http://localhost:5000/api/games
```

### Add Game (Admin)
```bash
curl -X POST http://localhost:5000/api/games \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"New Game","price":59.99,"platform":"PC","genre":"Action","stock":100,"image":"https://example.com/image.jpg"}'
```

### Place Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"items":[{"game":"GAME_ID","quantity":2}],"totalAmount":119.98}'
```

### Get My Orders
```bash
curl http://localhost:5000/api/orders/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Notes

- 🔒 indicates protected routes requiring authentication
- All dates are in ISO 8601 format
- All prices are in USD (number format)
- Stock is reduced automatically when orders are placed
- JWT tokens should be stored securely in localStorage
- Tokens should be included in Authorization header for protected routes
