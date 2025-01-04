# Booking Application: MVP Feature Specification

This document outlines the **User Stories** and **Acceptance Criteria** for the core MVP of a football slot booking application. It also includes an **Improvements List** for future enhancements.

---

## User Stories for Primary Stakeholders (Players)

1. **User Registration**  
   - **Story**: “As a user, I want to sign up for an account so that I can access booking features.”  
   - **Acceptance Criteria**:  
     - Users can register with valid credentials (e.g., email/password).  
     - Error messages appear for missing or invalid fields.  
     - Successful registration redirects to the main booking screen or login screen.

2. **User Login**  
   - **Story**: “As a user, I want to log in securely so that I can see and book available slots.”  
   - **Acceptance Criteria**:  
     - Users can input valid credentials and log in successfully.  
     - Incorrect credentials yield an error message.  
     - Logged-in users land on the main home screen or list of available slots.

3. **View Available Slots**  
   - **Story**: “As a user, I want to see a list of upcoming football slots so that I can choose which game to join.”  
   - **Acceptance Criteria**:  
     - The system displays upcoming slots with date, time, and available capacity.  
     - Past or full slots are hidden or clearly marked as unavailable.  
     - Users can quickly see how many spots remain in each slot.

4. **Book a Slot**  
   - **Story**: “As a user, I want to book a free slot quickly so that I can reserve my place in the game.”  
   - **Acceptance Criteria**:  
     - Tapping “Book” reserves the user’s spot and decreases the capacity by 1.  
     - The user sees an immediate on-screen confirmation.  
     - If a slot is full, the user cannot book, and a clear message is displayed (e.g., “Slot is full”).

5. **View My Bookings**  
   - **Story**: “As a user, I want to see my booked slots in one place so I can manage my schedule.”  
   - **Acceptance Criteria**:  
     - A “My Bookings” page or tab lists all upcoming bookings.  
     - Each entry shows date, time, and status (booked, canceled, etc.).  
     - Past bookings are hidden or marked as expired (depending on design).

6. **Cancel Booking**  
   - **Story**: “As a user, I want to cancel my booked slot if I can’t attend, so that someone else can use it.”  
   - **Acceptance Criteria**:  
     - Tapping “Cancel” removes the slot from the user’s bookings.  
     - The slot’s capacity is incremented (+1) after cancellation.  
     - A confirmation message ensures the user knows the booking was canceled.

7. **(Edge Case) Booking Limit**  
   - **Story**: “As a user, I can only have one upcoming game booked at a time, so that slots are distributed fairly.”  
   - **Acceptance Criteria**:  
     - If the user already has an upcoming booking, the system prevents a second booking.  
     - A clear error message is displayed if they attempt a second booking (e.g., “You already have one game booked. Cancel that first before booking a new one.”).  
     - Once the user cancels their existing booking, they can book another slot.

---

## Acceptance Criteria Recap

1. **Registration & Login**  
   - Valid credentials → user can enter the system.  
   - Invalid credentials → error message.

2. **Viewing & Booking Slots**  
   - Users see which slots are open or full.  
   - Booking a slot updates capacity in real time.  
   - If a slot is full, the user gets a “Slot is full” message.

3. **My Bookings & Cancellation**  
   - Users see a list of active bookings.  
   - Canceling frees up a spot and removes the booking from “My Bookings.”

4. **Booking Limit**  
   - Users cannot book if they already have one active booking.  
   - Clear message prevents second booking until the first is canceled.

---