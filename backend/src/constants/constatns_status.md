### 2. Constants (`constants/`)

*   **Functionality:** Defines application-wide constants.
*   **Architecture:**
    *   `index.js`: Exports an object containing constants like error codes, status messages, role definitions, or other fixed values used across the application.
*   **Tasks:**
    *   Define constants for error codes (e.g., `USER_NOT_FOUND`, `SLOT_FULL`).
    *   Define constants for status messages (e.g., `BOOKING_SUCCESSFUL`, `CANCELLATION_SUCCESSFUL`).
    *   Potentially define role constants (e.g., `USER`, `ADMIN`) if role-based access control is implemented later.