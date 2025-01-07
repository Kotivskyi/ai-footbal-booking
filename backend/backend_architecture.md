## 2. Components

The backend is structured into several key components, each with specific responsibilities:

### 2.1. Configuration (`config/`)
✅ Implemented
*   **`db.js`**: Handles MongoDB database connection using Mongoose:
    - Configures connection with flexible options support
    - Supports environment-specific configurations
    - Handles test vs production settings
    - Handles connection events and errors
    - Exports reusable database connection function

### 2.2. Constants (`constants/`)

*   **`index.js`**: Defines application-wide constants such as error codes, status messages, and potentially role definitions.

### 2.3. Controllers (`controllers/`)

Controllers handle incoming HTTP requests, orchestrate the necessary business logic by calling services, and return responses to the client.

*   **`authController.js`**:
    *   `register(req, res)`: Handles user registration requests. Receives user credentials, calls the `authService` to create a new user, and sends a success or error response.
    *   `login(req, res)`: Handles user login requests. Receives user credentials, calls the `authService` to authenticate the user and generate a JWT, and sends the token in the response.
*   **`bookingController.js`**:
    *   `getAllSlots(req, res)`: Retrieves a list of available football slots. Calls the `bookingService` to fetch and filter slots based on criteria (e.g., upcoming).
    *   `bookSlot(req, res)`: Handles requests to book a specific slot. Extracts the slot ID and user information, calls the `bookingService` to perform the booking, and sends a confirmation or error response. Enforces the "one active booking" rule.
    *   `cancelBooking(req, res)`: Handles requests to cancel a booking. Extracts the slot ID and user information, calls the `bookingService` to cancel the booking, and sends a confirmation response.
    *   `getMyBookings(req, res)`: Retrieves the list of bookings for the currently logged-in user. Calls the `bookingService` to fetch the user's bookings.

### 2.4. Middleware (`middleware/`)

Middleware functions are executed during the request-response cycle and handle tasks like authentication, authorization, and input validation.

*   **`authMiddleware.js`**:
    *   `authenticate(req, res, next)`: Verifies the JWT token from the request headers. If the token is valid, it attaches the user information to the request object; otherwise, it returns an authentication error.
*   **`validationMiddleware.js`**:
    *   Handles validation of request bodies and parameters. Can be implemented using libraries like `express-validator` to define validation schemas for different routes (e.g., registration, booking).

### 2.5. Models (`models/`)
✅ Implemented

Models define the structure of the data stored in the database and provide an interface for interacting with the database.

*   **User Model**:
    *   `email` (String, required, unique, indexed): User's email address for login
    *   `password` (String, required, min length 6): Password for authentication
    *   `createdAt` (Date, auto-generated): Timestamp of user registration
    *   Includes email format validation and uniqueness constraint

*   **Slot Model**:
    *   `date` (Date, required): Date of the football slot
    *   `time` (String, required): Time of the football slot
    *   `capacity` (Number, required, min 1): Maximum number of players
    *   `bookedBy` ([ObjectId], ref: 'User'): Array of user IDs who have booked
    *   Includes compound index on date+time and index on bookedBy

### 2.6. Routes (`routes/`)

Route definitions specify the API endpoints and map them to the corresponding controller actions.

*   **`authRoutes.js`**:
    ```javascript
    const express = require('express');
    const router = express.Router();
    const authController = require('../controllers/authController');

    router.post('/register', authController.register);
    router.post('/login', authController.login);

    module.exports = router;
    ```
*   **`bookingRoutes.js`**:
    ```javascript
    const express = require('express');
    const router = express.Router();
    const bookingController = require('../controllers/bookingController');
    const authMiddleware = require('../middleware/authMiddleware');

    router.get('/slots', bookingController.getAllSlots);
    router.post('/slots/:id/book', authMiddleware.authenticate, bookingController.bookSlot);
    router.post('/slots/:id/cancel', authMiddleware.authenticate, bookingController.cancelBooking);
    router.get('/my-bookings', authMiddleware.authenticate, bookingController.getMyBookings);

    module.exports = router;
    ```

### 2.7. Services (`services/`)

Services contain the core business logic of the application. They are called by controllers and interact with the models to perform data operations.

*   **`authService.js`**:
    *   `registerUser(email, password)`: Creates a new user in the database after validating the input and securely hashing the password using `bcrypt`.
    *   `loginUser(email, password)`: Authenticates a user by verifying the provided email and password against the stored credentials. Upon successful authentication, generates a JWT using `jsonwebtoken`.
*   **`bookingService.js`**:
    *   `getAvailableSlots()`: Fetches a list of upcoming football slots from the database. Can include filtering logic to exclude past or full slots.
    *   `bookSlot(slotId, userId)`: Handles the logic for booking a slot for a user. It checks if the slot is available (capacity > number of `bookedBy`), if the user has an existing booking, and then updates the `Slot` document by adding the user's ID to the `bookedBy` array. Decrements the capacity (implicitly or explicitly depending on implementation).
    *   `cancelBooking(slotId, userId)`: Handles the logic for canceling a user's booking. Removes the user's ID from the `bookedBy` array of the `Slot` document.
    *   `getUserBookings(userId)`: Retrieves a list of slots that have been booked by a specific user.
    *   `hasActiveBooking(userId)`: Checks if a user has any upcoming, booked slots to enforce the single booking limit.

### 2.8. Utilities (`utils/`)

Utility functions provide reusable helper functions for common tasks.

### 2.8. Entry Point (`index.js`)
⏳ In Progress
*   Main application file that:
    *   ✅ Initializes Express app
    *   ⏳ Configures middleware (CORS, body-parser)
    *   ✅ Database connection configuration ready
    *   🔲 Routes mounting pending

## 3. Data Flow

1. Client request → Express server
2. Request processing through middleware
3. Route handler forwards to appropriate controller
4. Controller calls relevant service
5. Service performs business logic using models
6. Response flows back through controller
7. Standardized response sent to client

## 4. Authentication Flow

1. Registration:
   - Service handles password hashing
   - User data saved to database
2. Login:
   - Service verifies credentials
   - JWT generated on success
3. Protected Routes:
   - Middleware verifies JWT
   - User data attached to request

## 5. Implementation Status

✅ Completed:
- Database configuration
- Configurable database connection options
- Model definitions with validation
- Database indexes for performance
- Basic project structure
- Unit test setup with Jest
- Test-specific database configuration

⏳ In Progress:
- Authentication implementation
- Express app setup
- Middleware configuration

🔲 Pending:
- Route implementation
- Controller logic
- Service layer

## 6. Security Considerations

1. Password Security:
   - Hashing handled in auth service
   - No password manipulation in models
2. JWT Implementation:
   - Tokens managed by auth service
   - Verification in middleware
3. Input Validation:
   - Model-level data validation
   - Request validation in middleware

## 7. Testing Strategy

### Test Environment
- Jest as test runner
- MongoDB Memory Server for database testing
- Environment-specific configuration through dotenv
- Configurable test timeouts and options

### Test Categories
1. **Unit Tests**
   - Model validation and relationships
   - Database connection handling with custom timeouts
   - Connection error scenarios with fast failures
   - Utility functions
   - Controller request handling
   - Middleware token verification
   - Response formatting

2. **Integration Tests** (Planned)
   - API endpoints
   - Authentication flow
   - Booking operations
   - Route protection
   - Middleware chains

3. **Test Coverage**
   - Track with Jest coverage reports
   - Run with: `npm run test:coverage`

### Test Commands
```bash
npm test           # Run all tests
npm run test:watch # Development mode with auto-rerun
```

### Test Organization
```
src/
└── tests/
    ├── config/
    │   └── db.test.js          # Database connection tests
    ├── models/
    │   └── models.test.js      # Model validation tests
    ├── auth/
    │   └── authController.test.js
    ├── middleware/
    │   └── authMiddleware.test.js
    ├── routes/
    │   └── authRoutes.test.js
    └── utils/
        └── apiResponse.test.js
```


