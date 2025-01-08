### 4. Middleware (`middleware/`)

*   **Functionality:** Intercepts and processes requests before they reach the controllers. Handles tasks like authentication, authorization, and input validation.
*   **Architecture:**
    *   `authMiddleware.js`:
        *   `authenticate(req, res, next)`: Verifies JWT tokens.
    *   `validationMiddleware.js`:
        *   Validates request bodies and parameters using a library like `express-validator`.
*   **Tasks:**
    *   `authMiddleware`:
        *   ✅ Verify the JWT token in the `Authorization` header.
        *   ✅ Decode the token to extract user information.
        *   ✅ Attach the user object to the request.
        *   ✅ Return error response if authentication fails.
    *   `validationMiddleware`:
        *   ⏳ Define validation schemas for different routes.
        *   ⏳ Validate request data against the schemas.
        *   ⏳ Return an error response if validation fails.

**Testing Strategy:**
- Unit tests for token verification
- Test invalid token scenarios
- Test validation rules
- Mock request/response objects
- Run with: `npm test`

**Implementation Status:**
- ✅ Auth Middleware: Complete with tests
- ⏳ Validation Middleware: In progress