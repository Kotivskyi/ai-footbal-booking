# API Documentation

## Base URL
`http://localhost:5000/api/v1`

## Authentication

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k",
    "email": "user@example.com"
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k",
      "email": "user@example.com"
    }
  }
}
```

## Slot Management

### Get Available Slots
```http
GET /slots
```

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `page` (optional): Pagination page number
- `limit` (optional): Items per page (default: 10)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k",
      "date": "2024-01-15",
      "time": "18:00",
      "capacity": 10,
      "available": 8
    }
  ]
}
```

## Booking Operations (Pending Implementation)

### Book a Slot
```http
POST /slots/{id}/book
```
**Authentication Required**  
`Authorization: Bearer <token>`

**Path Parameters:**
- `id`: Slot ID to book

**Success Response:**
```json
{
  "success": true,
  "data": {
    "slotId": "65a1b2c3d4e5f6g7h8i9j0k",
    "status": "confirmed",
    "bookingDate": "2024-01-15T18:00:00Z"
  }
}
```

**Error Responses:**
- 400: Already booked by user
- 404: Slot not found
- 409: Slot full

### Cancel Booking
```http
POST /slots/{id}/cancel
```
**Authentication Required**  
`Authorization: Bearer <token>`

**Path Parameters:**
- `id`: Slot ID to cancel

**Success Response:**
```json
{
  "success": true,
  "data": {
    "slotId": "65a1b2c3d4e5f6g7h8i9j0k",
    "status": "cancelled"
  }
}
```

**Error Responses:**
- 404: Booking not found
- 403: User not authorized to cancel

### Get User Bookings
```http
GET /my-bookings
```
**Authentication Required**  
`Authorization: Bearer <token>`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k",
      "date": "2024-01-15",
      "time": "18:00",
      "status": "confirmed"
    }
  ]
}
```

**Query Parameters:**
- `status` (optional): Filter by booking status
- `page`, `limit`: Pagination controls

## Admin Endpoints (Future)

### Create Slot (Admin)
```http
POST /admin/slots
```

### Update Slot (Admin)
```http
PATCH /admin/slots/{id}
```

## Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid email format"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Authentication Error",
  "message": "Invalid credentials"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Server Error",
  "message": "Something went wrong"
}
``` 