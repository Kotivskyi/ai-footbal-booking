### 9. Entry Point (`index.js`)

*   **Functionality:** Initializes the application, connects to the database, sets up middleware, and mounts the routes.
*   **Architecture:**
    *   The main application file.
*   **Tasks:**
    *   Import necessary modules (Express, Mongoose, routes, etc.).
    *   Create an Express app instance.
    *   Configure middleware (CORS, body-parser).
    *   Connect to the MongoDB database using the `config/db.js` module.
    *   Mount the `authRoutes` and `bookingRoutes` to their respective base paths.
    *   Start the server and listen on a specified port.
