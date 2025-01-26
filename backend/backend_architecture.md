# Backend Architecture

## 1. Project Structure

src/
├── config/             # Configuration files (database, etc.)
│   └── db.js
├── constants/          # Define constant values
│   └── index.js
├── controllers/        # Handles incoming requests and responses
│   ├── authController.js
│   └── bookingController.js
├── middleware/         # Handles request processing (authentication, validation)
│   ├── authMiddleware.js
│   └── validationMiddleware.js
├── models/             # Defines data structures and interacts with the database
│   ├── User.js
│   └── Slot.js
├── routes/             # Defines API endpoints
│   ├── authRoutes.js
│   └── bookingRoutes.js
├── services/           # Business logic and data manipulation
│   ├── authService.js
│   └── bookingService.js
├── utils/              # Utility functions
│   └── apiResponse.js
└── index.js            # Entry point of the application

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
    *   ✅ `getAllSlots(req, res)`: Retrieves available football slots
        - Calls bookingService.getAvailableSlots
        - Returns filtered slots with status codes
    *   🔲 `bookSlot(req, res)`: Handles slot booking
        - Validates booking capacity
        - Enforces one-booking rule
    *   🔲 `cancelBooking(req, res)`: Handles cancellation
        - Validates user ownership
        - Updates slot availability
    *   🔲 `getMyBookings(req, res)`: Gets user bookings
        - Filters by booking status
        - Implements pagination

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
*   **`bookingService.js`**:
    *   ✅ `getAvailableSlots()`: MongoDB aggregation for slots
        - Filters by capacity and date
        - Projects required fields
        - Implements pagination
    *   🔲 `bookSlot(userId, slotId)`: Creates booking
        - Checks existing bookings
        - Updates slot capacity
    *   🔲 `cancelBooking(userId, slotId)`: Removes booking
        - Validates user ownership
        - Restores slot capacity
    *   🔲 `getUserBookings(userId)`: Retrieves user bookings
        - Populates slot details
        - Filters by status

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
- Basic slot management implementation
- Slot availability checks via aggregation
- Unit tests for slot fetching
- Controller-service integration

🔲 Pending:
- Booking creation/cancellation logic
- User booking management
- Admin endpoints implementation

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

Testing is crucial for ensuring the reliability and correctness of the backend application. We employ a two-pronged approach with unit tests and integration tests.

### 7.1. Unit Tests

Unit tests focus on verifying the logic of individual, isolated components.

*   **Purpose**:
    *   Validate the business logic within services, models, and utility functions in isolation.
    *   Ensure that each component functions correctly independently.
    *   Enable rapid feedback during development by quickly testing code changes.
*   **Scope**:
    *   Test individual functions or methods within modules.
    *   Mock dependencies (e.g., database interactions, external APIs) to isolate the component under test.
    *   Focus on testing logic, algorithms, and edge cases within the component.
*   **Location**:
    *   Unit tests are located in the `tests/unit/` directory, mirroring the `src/` directory structure.
    *   For example, unit tests for services are in `tests/unit/services/`, and for models in `tests/unit/models/`.
*   **Example Components to Unit Test**:
    *   Service layer functions (e.g., `authService.registerUser`, `bookingService.getAvailableSlots`).
    *   Model validation logic and custom methods.
    *   Utility functions (e.g., API response helpers).
    *   Middleware functions (in isolation, testing specific logic).
*   **Tools and Techniques**:
    *   **Test Runner**: Jest.
    *   **Mocking**: Jest's mocking capabilities to isolate components.
    *   **Assertion Library**: Jest's built-in `expect`.

### 7.2. Integration Tests

Integration tests verify the interactions between different components and layers of the application, ensuring they work together correctly.

*   **Purpose**:
    *   Validate the data flow and interactions between controllers, services, models, and middleware.
    *   Ensure that different parts of the application integrate seamlessly.
    *   Test real database interactions using MongoDB Memory Server.
    *   Verify end-to-end functionality for key features (e.g., user registration, booking flow).
*   **Scope**:
    *   Test interactions between controllers and services.
    *   Test interactions between services and models, including database operations.
    *   Test API endpoints, encompassing routes, controllers, middleware, services, and models.
    *   Focus on testing complete user flows and feature functionality.
*   **Location**:
    *   Integration tests are located in the `tests/integration/` directory.
    *   Organized by feature within `tests/integration/features/` (e.g., `auth/`, `booking/`).
    *   Setup and utility files are in `tests/integration/setup/`, `tests/integration/helpers/`, and `tests/integration/fixtures/`.
*   **Structure**:
    ```
    tests/integration/
    ├── setup/           # Global test setup/teardown (setup.js, teardown.js)
    ├── fixtures/        # Test data (users.js, slots.js)
    ├── helpers/         # Test utilities (database.js, request.js)
    └── features/        # Feature-based test suites
        ├── auth/        # Auth feature tests (register.test.js, login.test.js)
        └── booking/     # Booking feature tests (availability.test.js, create.test.js, cancel.test.js)
    ```
*   **Key Components**:
    *   **Test Runner**: Jest.
    *   **HTTP Client**: Supertest (for API endpoint testing).
    *   **Test Database**: MongoDB Memory Server (for real database interactions).
    *   **Assertion Library**: Jest's built-in `expect`.
    *   **Test Helpers**:
        *   `database.js`: Utilities for database seeding, clearing, and setup.
        *   `request.js`: Wrapper around Supertest to simplify API requests and handle authentication.
    *   **Test Fixtures**:
        *   `users.js`: Predefined user data for tests.
        *   `slots.js`: Predefined slot data for tests.

### 7.3. Test Environment
✅ Jest configured as test runner
✅ MongoDB Memory Server for isolated testing
✅ Environment-specific test configuration
✅ Custom test timeouts and options

### 7.4. Test Coverage
*   Track coverage using Jest coverage reports (`npm run test:coverage`).
*   Aim for:
    *   100% path coverage for critical auth flows.
    *   90%+ path coverage for core booking flows.
    *   Coverage should focus on business logic and critical paths.

### 7.5. Test Commands
npm test                  # Run all tests (unit and integration)
npm run test:unit         # Run unit tests only
npm run test:integration    # Run integration tests only
npm run test:coverage       # Generate coverage report


