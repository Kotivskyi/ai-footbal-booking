### 5. Models (`models/`)

*   **User Model**:
    *   `email` (String, required, unique, indexed): User's email address for login
    *   `password` (String, required, min length 6): Password for authentication
    *   `createdAt` (Date, auto-generated): Timestamp of user registration
    *   Includes email format validation and uniqueness constraint

*   **Slot Model**:
    *   `date` (Date, required): Date of the football slot
    *   `time` (String, required): Time of the football slot
    *   `capacity` (Number, required, min 1): Maximum number of players
    *   `bookedBy` ([ObjectId], ref: 'User'): Array of user IDs who have booked
    *   Includes compound index on date+time and index on bookedBy

*   **Functionality:** Define the structure of the data (schemas) and provide an interface for interacting with the database.
*   **Architecture:**
    *   ✅ `User.js`: Defines the `User` schema (email, password, createdAt).
    *   ✅ `Slot.js`: Defines the `Slot` schema (date, time, capacity, bookedBy).
*   **Tasks:**
    *   ✅ Define Mongoose schemas for `User` and `Slot` entities.
    *   ✅ Specify data types, required fields, and relationships (e.g., `bookedBy` in `Slot` referencing `User`).
    *   ✅ Add indexes for performance optimization:
        - Email index on User model
        - Compound index (date, time) on Slot model
        - BookedBy index on Slot model
    *   ✅ Export Mongoose models for use in services.

**Next Steps:**
- Add model-specific validation rules if needed
- Consider adding virtual fields for derived data
- Document model relationships and constraints

**Testing Strategy:**
- Comprehensive validation tests
- Data integrity tests
- Relationship tests
- Run with: `npm test`