## 2. Components

The backend is structured into several key components, each with specific responsibilities:

### 2.1. Configuration (`config/`)

*   **`db.js`**: Handles the connection to the MongoDB database using Mongoose. It manages connection events and exports the database connection.

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

Models define the structure of the data stored in the database and provide an interface for interacting with the database.

*   **`User.js`**:
    ```javascript
    const mongoose = require('mongoose');
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    });
    module.exports = mongoose.model('User', userSchema);
    ```
*   **`Slot.js`**:
    ```javascript
    const mongoose = require('mongoose');
    const slotSchema = new mongoose.Schema({
      date: { type: Date, required: true },
      time: { type: String, required: true },
      capacity: { type: Number, required: true },
      bookedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    });
    module.exports = mongoose.model('Slot', slotSchema);
    ```

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

*   **`apiResponse.js`**: A utility function or class to create consistent and structured API responses, including status codes, messages, and data.

### 2.9. Entry Point (`index.js`)

*   The main entry point of the application. It initializes the Express app, connects to the database, sets up middleware, and mounts the routes.

    ```javascript
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    require('dotenv').config();
    const authRoutes = require('./routes/authRoutes');
    const bookingRoutes = require('./routes/bookingRoutes');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/bookings', bookingRoutes);

    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB Connected'))
      .catch(err => console.error('MongoDB Connection Error:', err));

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    ```

## 3. Data Flow

1. The iOS app sends an HTTP request to a specific backend endpoint.
2. The request is received by the Express server and processed by relevant middleware (e.g., authentication, validation).
3. The request is routed to the appropriate controller based on the endpoint.
4. The controller calls the relevant service to handle the business logic.
5. The service interacts with the MongoDB database through Mongoose models to retrieve or manipulate data.
6. The service returns the result to the controller.
7. The controller formats the response using the `apiResponse` utility and sends it back to the iOS app.

## 4. Database Models (Detailed)

*   **User Model**:
    *   `email` (String, required, unique): User's email address for login.
    *   `password` (String, required): Hashed password for secure authentication.
    *   `createdAt` (Date, default: Date.now): Timestamp of user registration.
*   **Slot Model**:
    *   `date` (Date, required): Date of the football slot.
    *   `time` (String, required): Time of the football slot.
    *   `capacity` (Number, required): Maximum number of players for the slot.
    *   `bookedBy` ([ObjectId], ref: 'User'): Array of user IDs who have booked the slot.

## 5. Key Considerations

*   **Authentication**: JWT-based authentication ensures stateless and scalable user sessions.
*   **Authorization**: Middleware can be extended to handle role-based authorization if admin features are added later.
*   **Data Validation**: Input validation is crucial to ensure data integrity and prevent errors.
*   **Error Handling**: Consistent error responses provide a better developer experience for the frontend.
*   **Scalability**: The stateless nature of the backend and the use of MongoDB allow for horizontal scaling.

This architecture provides a solid foundation for building the football slot booking application, addressing the core requirements outlined in the user stories and project overview.