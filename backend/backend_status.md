# Backend Implementation Plan

This document outlines the plan for implementing the backend of the football slot booking application.

## Phase 1: Project Setup and Core Functionality (Estimated Time: 1 week)

*   **Task 1.1: Set up the project environment (1 day)**
    *   ✅ Initialize a new Node.js project (`npm init -y`).
    *   ✅ Install core dependencies: `express`, `mongoose`, `cors`, `dotenv`.
    *   ✅ Create basic directory structure (`src`, `config`, `constants`, etc.).
*   **Task 1.2: Database Setup (1 day)**
    *   ✅ Set up a MongoDB database (local configuration).
    *   ✅ Create `config/db.js` to connect to the database.
    *   ✅ Define `User` and `Slot` models in `models/`.
    *   ✅ Add performance optimization (indexes).
*   **Task 1.3: Implement User Authentication (3 days)**
    *   ✅ Create `authController.js` and `authService.js`.
    *   ✅ Implement user registration:
        *   ✅ Define registration route in `authRoutes.js`.
        *   ✅ Implement registration logic in `authController` (handle request, call service).
        *   ✅ Implement `registerUser` in `authService` (validate input, hash password with `bcrypt`, save user).
    *   ✅ Implement user login:
        *   ✅ Define login route in `authRoutes.js`.
        *   ✅ Implement login logic in `authController`.
        *   ✅ Implement `loginUser` in `authService` (verify credentials, generate JWT with `jsonwebtoken`).
    *   ✅ Create `authMiddleware.js` to protect routes.
*   **Task 1.4: Basic Slot Management (2 days)**
    *   ✅ Create `bookingController.js` and `bookingService.js`.
    *   ✅ Implement fetching available slots:
        *   ✅ Define route in `bookingRoutes.js`
        *   ✅ Implement logic in `bookingController` to fetch slots
        *   ✅ Implement `getAvailableSlots` in `bookingService` using MongoDB aggregation
    *   ✅ Add unit tests for booking functionality

## Phase 2: Booking Functionality (Estimated Time: 1 week)

*   **Task 2.1: Implement Booking a Slot (3 days)**
    *   Implement booking logic in `bookingController`:
        *   Define route in `bookingRoutes.js` (protected by `authMiddleware`).
        *   Implement logic to handle booking request.
    *   Implement `bookSlot` in `bookingService`:
        *   Check slot availability (capacity).
        *   Check if the user has an existing booking.
        *   Update the `Slot` document (add user to `bookedBy`).
    *   **Acceptance Criteria:**
        *   **Successful Booking:** A user can successfully book an available slot.
            *   When a user books a slot, their `userId` is added to the `bookedBy` array of the corresponding `Slot` document in the database.
            *   The booking endpoint returns a success status code (e.g., 200 OK or 201 Created) and a confirmation message or the updated `Slot` information.
        *   **Slot Capacity Limit:**  Users cannot book a slot if it is already at full capacity.
            *   If a user attempts to book a slot that is full, the booking endpoint returns an appropriate error status code (e.g., 400 Bad Request or 409 Conflict) and an error message indicating that the slot is full.
        *   **Duplicate Booking Prevention:** A user cannot book the same slot more than once.
            *   If a user attempts to book a slot they have already booked, the booking endpoint returns an appropriate error status code (e.g., 400 Bad Request or 409 Conflict) and an error message indicating that the user already has a booking for this slot.
        *   **Authentication and Authorization:** The booking route is protected by `authMiddleware`.
            *   Only authenticated users can access the booking route. Unauthenticated users should receive a 401 Unauthorized error.
        *   **Input Validation:** The booking endpoint validates the request body.
            *   The endpoint expects a valid `slotId` in the request. Invalid or missing `slotId` should result in a 400 Bad Request error.
        *   **Error Handling:** The application handles errors gracefully.
            *   In case of any server errors or database issues during the booking process, the endpoint returns an appropriate error status code (e.g., 500 Internal Server Error) and a user-friendly error message.
        *   **Logging:**  Detailed logs are recorded for booking attempts (successful and failed).
            *   Logs should include relevant information such as user ID, slot ID, timestamp, and the outcome of the booking attempt (success or failure with error details). Use trace, debug, error, and critical log levels as appropriate.
        *   **Unit and Integration Tests:** Unit tests are implemented for the `bookSlot` service function, and integration tests are implemented for the booking endpoint to ensure the booking logic works as expected.
*   **Task 2.2: Implement Viewing User Bookings (2 days)**
    *   Implement logic in `bookingController`:
        *   Define route in `bookingRoutes.js` (protected by `authMiddleware`).
        *   Implement logic to fetch bookings for the logged-in user.
    *   Implement `getUserBookings` in `bookingService`.
*   **Task 2.3: Implement Canceling a Booking (2 days)**
    *   Implement cancellation logic in `bookingController`:
        *   Define route in `bookingRoutes.js` (protected by `authMiddleware`).
        *   Implement logic to handle cancellation request.
    *   Implement `cancelBooking` in `bookingService`:
        *   Remove the user from the `bookedBy` array in the `Slot` document.

## Phase 3: Enhancements and Refinements (Estimated Time: 1 week - ongoing)

*   **Task 3.1: Input Validation (2 days)**
    *   ✅ Implement model-level validation for User and Slot.
    *   ⏳ Implement request validation for registration and login.
    *   🔲 Implement request validation for booking actions.
*   **Task 3.2: Error Handling and API Responses (2 days)**
    *   ✅ Implement consistent error handling in auth components.
    *   ⏳ Create `utils/apiResponse.js` for standardized API responses.
*   **Task 3.3: Testing (3 days - ongoing)**
    *   ✅ Set up Jest testing environment
    *   ✅ Add MongoDB Memory Server for database testing
    *   ✅ Write unit tests for auth components
    *   ✅ Write integration tests for auth routes
    *   🔲 Write tests for booking functionality
*   **Task 3.4: Documentation (Ongoing)**
    *   ✅ Document auth endpoints and models
    *   🔲 Document booking endpoints
*   **Task 3.5: Refactoring and Optimization (Ongoing)**
    *   ✅ Optimize database connection handling
    *   ✅ Add database indexes for performance
    *   ⏳ Review and refactor auth components

## Dependencies

*   Phase 2 depends on the completion of basic authentication in Phase 1.
*   Input validation and error handling (Phase 3) can be integrated incrementally after core functionalities are implemented.

## Status Tracking

| Task | Status | Notes |
|---|---|---|
| Task 1.1 | ✅ Complete | Project structure and dependencies set up |
| Task 1.2 | ✅ Complete | Database models and connection configured |
| Task 1.3 | ✅ Complete | Authentication system implemented with tests |
| Task 1.4 | ✅ Complete | Basic slot management implemented with tests |
| Task 1.5 | 🔲 To Do | Integration tests setup and implementation |
| Task 2.1 | 🔲 To Do |  |
| Task 2.2 | 🔲 To Do |  |
| Task 2.3 | 🔲 To Do |  |
| Task 3.1 | ⏳ In Progress | Model validation complete, request validation in progress |
| Task 3.2 | ⏳ In Progress | Error handling implemented for auth |
| Task 3.3 | ✅ Complete | Auth and booking tests implemented |
| Task 3.4 | ⏳ In Progress | Auth documentation complete |
| Task 3.5 | ⏳ In Progress | Database optimizations complete |

Legend:
- ✅ Complete
- ⏳ In Progress
- 🔲 To Do

This plan provides a roadmap for the backend implementation. The estimated times are subject to change based on progress and complexity. Regular reviews and updates to this plan are recommended.
