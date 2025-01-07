### 8. Utilities (`utils/`)

*   **Functionality:** Provide reusable helper functions.
*   **Architecture:**
    *   `apiResponse.js`: Creates consistent API responses.
*   **Tasks:**
    *   `apiResponse`:
        *   Define a function or class to format API responses with status codes, messages, and data.
        *   Ensure consistent response structure across all endpoints.

**Testing Strategy:**
- Unit tests for response formatting
- Test different response types (success/error)
- Verify response structure
- Run with: `npm test`