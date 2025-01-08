### 9. Entry Point (`index.js`)

*   **Functionality:** Initializes the application, connects to the database, sets up middleware, and mounts the routes.
*   **Architecture:**
    *   The main application file.
*   **Tasks:**
    *   ✅ Import necessary modules (Express, Mongoose, routes, etc.).
    *   ✅ Create an Express app instance.
    *   ✅ Configure middleware (CORS, body-parser).
    *   ✅ Database connection configuration ready through `config/db.js` module.
    *   ⏳ Mount the `authRoutes` and `bookingRoutes` to their respective base paths.
    *   ⏳ Start the server and listen on a specified port.

**Next Steps:**
- Complete the Express app setup
- Configure and mount middleware
- Set up routes
- Implement error handling middleware

**Testing Strategy:**
1. **API Endpoint Testing:**
   ```bash
   # Test User Registration
   curl -X POST http://localhost:5001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'

   # Test User Login
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Expected Responses:**
   - Registration Success: Status 201, message confirming registration
   - Login Success: Status 200, JWT token and user details
   - Error Cases: Appropriate error messages and status codes
