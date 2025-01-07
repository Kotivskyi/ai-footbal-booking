### 1. Configuration (`config/`)

*   **Functionality:** Manages the application's configuration settings, primarily the database connection.
*   **Architecture:**
    *   ✅ `db.js`: Contains the logic to connect to the MongoDB database using Mongoose. It handles connection events (success, error, disconnection) and exports the active database connection for use in other modules.
*   **Tasks:**
    *   ✅ Establish a connection to the MongoDB database upon application startup.
    *   ✅ Handle connection errors gracefully and log them.
    *   ✅ Provide a reusable database connection object.
    *   ✅ Configure connection options (useNewUrlParser, useUnifiedTopology)

**Next Steps:**
- Add connection event listeners for disconnection handling
- Implement connection pooling configuration if needed
- Add retry logic for connection failures