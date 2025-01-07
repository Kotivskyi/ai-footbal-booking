### 6. Routes (`routes/`)

*   **Functionality:** Define the API endpoints and map them to the corresponding controller actions.
*   **Architecture:**
    *   `authRoutes.js`: Defines routes for user registration and login.
    *   `bookingRoutes.js`: Defines routes for slot management and booking operations.
*   **Tasks:**
    *   Create Express Router instances.
    *   Define routes for each API endpoint (e.g., `/api/auth/register`, `/api/bookings/slots`).
    *   Map routes to the appropriate controller actions.
    *   Apply middleware (e.g., `authMiddleware`) to protected routes.
    *   Export the router instances for use in the main application file.

**Testing Strategy:**
- Integration tests for endpoints
- Test route protection
- Verify middleware chain
- Test request handling
- Run with: `npm test`