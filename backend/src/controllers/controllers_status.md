## 3. Controllers (`controllers/`)

*   **Functionality:** Act as intermediaries between incoming HTTP requests and the service layer. They handle request parsing, call the appropriate service methods, and format the responses.
*   **Architecture:**
    *   `authController.js`:
        *   `register(req, res)`: Handles user registration.
        *   `login(req, res)`: Handles user login.
    *   `bookingController.js`:
        *   `getAllSlots(req, res)`: Retrieves available slots.
        *   `bookSlot(req, res)`: Handles slot booking.
        *   `cancelBooking(req, res)`: Handles booking cancellation.
        *   `getMyBookings(req, res)`: Retrieves a user's bookings.
*   **Tasks:**
    *   ✅ Receive and parse HTTP requests.
    *   ✅ Extract data from request bodies and parameters.
    *   ⏳ Validate request data (can be delegated to middleware).
    *   ✅ Call the corresponding service methods for authentication.
    *   ⏳ Format the response data using the `apiResponse` utility.
    *   ✅ Send HTTP responses with appropriate status codes.

**Testing Strategy:**
- Unit tests for request handling
- Mock service layer interactions
- Test error handling scenarios
- Verify response formatting
- Run with: `npm test`

**Implementation Status:**
- ✅ Auth Controller: Registration and login implemented
- 🔲 Booking Controller: Pending implementation