### 7. Services (`services/`)

*   **Functionality:** Contain the core business logic of the application. They are called by controllers and interact with the models to perform data operations.
*   **Architecture:**
    *   `authService.js`:
        *   `registerUser(email, password)`: Creates a new user.
        *   `loginUser(email, password)`: Authenticates a user and generates a JWT.
    *   `bookingService.js`:
        *   `getAvailableSlots()`: Fetches available slots.
        *   `bookSlot(slotId, userId)`: Books a slot for a user.
        *   `cancelBooking(slotId, userId)`: Cancels a booking.
        *   `getUserBookings(userId)`: Retrieves a user's bookings.
        *   `hasActiveBooking(userId)`: Checks for existing active bookings.
*   **Tasks:**
    *   `authService`:
        *   Validate user input during registration.
        *   Hash passwords using `bcrypt`.
        *   Create new user documents in the database.
        *   Verify user credentials during login.
        *   Generate JWTs using `jsonwebtoken`.
    *   `bookingService`:
        *   Query the database for available slots, filtering by date, time, and capacity.
        *   Check slot availability and user's existing bookings before booking.
        *   Update the `Slot` document to add/remove a user from `bookedBy`.
        *   Query the database for a user's bookings.
        *   Enforce the single active booking rule.

**Verification Strategy:**
```bash
# Run service unit tests
npm test -- services.test.js

# Manual service verification
node -e "
const authService = require('./src/services/authService');
const bookingService = require('./src/services/bookingService');

// Test user registration
authService.registerUser('test@test.com', 'password123')
  .then(() => console.log('✅ Registration test passed'))
  .catch(err => console.error('❌ Registration test failed:', err));"
```