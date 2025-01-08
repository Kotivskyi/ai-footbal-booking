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
*   **`mongoConfig.js`**: Manages MongoDB connection options:
    - Environment-specific configurations
    - Connection pooling settings
    - Timeout configurations

### 2.2. Constants (`constants/`)

*   **`index.js`**: Defines application-wide constants such as error codes, status messages, and potentially role definitions.

### 2.3. Controllers (`controllers/`)

Controllers handle incoming HTTP requests, orchestrate the necessary business logic by calling services, and return responses to the client.

*   **`authController.js`**:
    *   ✅ `register(req, res)`: Handles user registration requests
        - Validates registration data
        - Calls authService.registerUser
        - Returns 201 on success, appropriate error codes on failure
    *   ✅ `login(req, res)`: Handles user login requests
        - Validates login credentials
        - Calls authService.loginUser
        - Returns JWT token and user details on success
*   **`bookingController.js`**:
    *   `getAllSlots(req, res)`: Retrieves a list of available football slots. Calls the `bookingService` to fetch and filter slots based on criteria (e.g., upcoming).
    *   `bookSlot(req, res)`: Handles requests to book a specific slot. Extracts the slot ID and user information, calls the `bookingService` to perform the booking, and sends a confirmation or error response. Enforces the "one active booking" rule.
    *   `cancelBooking(req, res)`: Handles requests to cancel a booking. Extracts the slot ID and user information, calls the `bookingService` to cancel the booking, and sends a confirmation response.
    *   `getMyBookings(req, res)`: Retrieves the list of bookings for the currently logged-in user. Calls the `bookingService` to fetch the user's bookings.

### 2.4. Middleware (`middleware/`)

Middleware functions are executed during the request-response cycle and handle tasks like authentication, authorization, and input validation.

*   **`authMiddleware.js`**:
    *   ✅ `authenticate(req, res, next)`: JWT token verification
        - Extracts token from Authorization header
        - Verifies token validity
        - Attaches user data to request
        - Handles authentication errors
*   **`validationMiddleware.js`**:
    *   Handles validation of request bodies and parameters. Can be implemented using libraries like `express-validator` to define validation schemas for different routes (e.g., registration, booking).

### 2.5. Models (`models/`)
✅ Implemented

Models define the structure of the data stored in the database and provide an interface for interacting with the database.

*   **User Model**:
    *   ✅ Schema Definition:
        - `email`: String, required, unique, indexed, validated
        - `password`: String, required, min length 6, hashed
        - `createdAt`: Date, auto-generated
    *   ✅ Indexes:
        - Email index for faster lookups
    *   ✅ Validations:
        - Email format validation
        - Password length validation

*   **Slot Model**:
    *   ✅ Schema Definition:
        - `date`: Date, required
        - `time`: String, required
        - `capacity`: Number, required, min 1
        - `bookedBy`: [ObjectId] with User reference
    *   ✅ Indexes:
        - Compound index on date+time
        - Index on bookedBy
    *   ✅ Validations:
        - Capacity validation

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
    *   ✅ `registerUser(email, password)`: User registration
        - Checks for existing users
        - Hashes passwords with bcrypt
        - Creates new user records
    *   ✅ `loginUser(email, password)`: User authentication
        - Verifies credentials
        - Generates JWT tokens
        - Returns user data
*   **`bookingService.js`**: Handles business logic for slot management and booking operations
    - Slot availability checks
    - Booking creation and cancellation
    - User booking retrieval

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
    - ✅ Password hashing with bcrypt
    - ✅ Secure password storage
    - ✅ No plain text passwords
2. JWT Implementation:
    - ✅ JWT generation in auth service
    - ✅ Token verification in middleware
    - ✅ Secure token handling
3. Input Validation:
    - ✅ Model-level validation implemented
    - ⏳ Request validation in progress
    - 🔲 Booking validation pending

## 7. Testing Strategy

### Test Environment

✅ Jest configured as test runner
✅ MongoDB Memory Server for isolated testing
✅ Environment-specific test configuration
✅ Custom test timeouts and options

### Test Architecture

1. **Unit Tests**
    - Test individual components in isolation
    - Mock dependencies and external services
    - Focus on business logic and edge cases
    - Components:
        - ✅ Model validation tests
        - ✅ Service layer tests
        - ✅ Controller logic tests
        - ✅ Utility function tests
        - ✅ Middleware tests

2. **Integration Tests**
    - Test component interactions and data flow
    - Components:
        ```
        tests/
        ├── unit/
        │   ├── models/
        │   ├── services/
        │   └── controllers/
        └── integration/
            ├── setup/
            │   ├── setup.js         # Global test setup
            │   └── teardown.js      # Global test cleanup
            ├── fixtures/
            │   ├── users.js         # Test data
            │   └── slots.js         # Test data
            ├── helpers/
            │   ├── database.js      # DB utilities
            │   └── request.js       # API request utilities
            └── features/
                ├── auth/
                │   ├── register.test.js
                │   └── login.test.js
                └── booking/
                    ├── create.test.js
                    └── cancel.test.js
        ```
    - Key Components:
        - Test Runner (Jest)
        - HTTP Client (Supertest)
        - Test Database (MongoDB Memory Server)
        - Assertion Library
        - Setup/Teardown Scripts

3. **Test Coverage**
    - Track with Jest coverage reports
    - Run with: `npm run test:coverage`

### Test Commands
```bash
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:int      # Run integration tests only
npm run test:coverage # Generate coverage report
```


