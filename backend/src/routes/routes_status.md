### 6. Routes (`routes/`)

*   **Functionality:** Define the API endpoints and map them to the corresponding controller actions.
*   **Architecture:**
    *   `authRoutes.js`: Defines routes for user registration and login.
    *   `bookingRoutes.js`: Defines routes for slot management and booking operations.
*   **Tasks:**
    *   ✅ Create Express Router instances.
    *   ✅ Define auth routes (`/api/auth/register`, `/api/auth/login`).
    *   🔲 Define booking routes (`/api/bookings/*`).
    *   ✅ Map auth routes to controller actions.
    *   ✅ Apply auth middleware to protected routes.
    *   ✅ Export router instances.

**Testing Strategy:**
- Integration tests for endpoints
- Test route protection
- Verify middleware chain
- Test request handling
- Run with: `npm test`

**Implementation Status:**
- ✅ Auth Routes: Complete with tests
- 🔲 Booking Routes: Not started