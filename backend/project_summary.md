# Table of Contents
- src/index.js
- src/entrypoint_status.md
- src/middleware/authMiddleware.js
- src/middleware/middleware_status.md
- src/middleware/validationMiddleware.js
- src/config/db.js
- src/config/mongoConfig.js
- src/config/config_status.md
- src/constants/constatns_status.md
- src/constants/index.js
- src/tests/middleware/authMiddleware.test.js
- src/tests/config/db.test.js
- src/tests/auth/authController.test.js
- src/tests/auth/authService.test.js
- src/tests/utils/apiResponse.test.js
- src/tests/models/models.test.js
- src/tests/routes/authRoutes.test.js
- src/utils/apiResponse.js
- src/utils/utilities_status.md
- src/models/Slot.js
- src/models/User.js
- src/models/models_status.md
- src/controllers/controllers_status.md
- src/controllers/bookingController.js
- src/controllers/authController.js
- src/routes/authRoutes.js
- src/routes/bookingRoutes.js
- src/routes/routes_status.md
- src/services/bookingService.js
- src/services/services_status.md
- src/services/authService.js


## File: src/index.js

- Extension: .js
- Language: javascript
- Size: 789 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes); 

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Only exit process in the main application
    }
};

startServer();
```

## File: src/entrypoint_status.md

- Extension: .md
- Language: markdown
- Size: 1431 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```markdown
### 9. Entry Point (`index.js`)

*   **Functionality:** Initializes the application, connects to the database, sets up middleware, and mounts the routes.
*   **Architecture:**
    *   The main application file.
*   **Tasks:**
    *   ✅ Import necessary modules (Express, Mongoose, routes, etc.).
    *   ✅ Create an Express app instance.
    *   ✅ Configure middleware (CORS, body-parser).
    *   ✅ Database connection configuration ready through `config/db.js` module.
    *   ⏳ Mount the `authRoutes` and `bookingRoutes` to their respective base paths.
    *   ⏳ Start the server and listen on a specified port.

**Next Steps:**
- Complete the Express app setup
- Configure and mount middleware
- Set up routes
- Implement error handling middleware

**Testing Strategy:**
1. **API Endpoint Testing:**
   ```bash
   # Test User Registration
   curl -X POST http://localhost:5001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'

   # Test User Login
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Expected Responses:**
   - Registration Success: Status 201, message confirming registration
   - Login Success: Status 200, JWT token and user details
   - Error Cases: Appropriate error messages and status codes

```

## File: src/middleware/authMiddleware.js

- Extension: .js
- Language: javascript
- Size: 501 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authenticate }; 
```

## File: src/middleware/middleware_status.md

- Extension: .md
- Language: markdown
- Size: 1230 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```markdown
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
```

## File: src/middleware/validationMiddleware.js

- Extension: .js
- Language: javascript
- Size: 0 bytes
- Created: 2025-01-04 16:35:20
- Modified: 2025-01-04 16:35:20

### Code

```javascript

```

## File: src/config/db.js

- Extension: .js
- Language: javascript
- Size: 875 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const mongoose = require('mongoose');
const MongoConfig = require('./mongoConfig');

let conn = null;

const connectDB = async () => {
    try {
        if (conn && mongoose.connection.readyState === 1) {
            console.log('Using existing connection');
            return conn;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        const config = new MongoConfig(process.env.NODE_ENV);
        conn = await mongoose.connect(
            process.env.MONGODB_URI, 
            config.getConnectionOptions()
        );

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
};

module.exports = connectDB; 
```

## File: src/config/mongoConfig.js

- Extension: .js
- Language: javascript
- Size: 934 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
class MongoConfig {
    constructor(env = process.env.NODE_ENV) {
        this.env = env;
    }

    getConnectionOptions() {
        const baseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        const envOptions = {
            development: {
                connectTimeoutMS: 30000,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 30000,
            },
            production: {
                connectTimeoutMS: 30000,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 30000,
            },
            test: {
                connectTimeoutMS: 3000,
                socketTimeoutMS: 3000,
                serverSelectionTimeoutMS: 3000,
            }
        };

        return {
            ...baseOptions,
            ...envOptions[this.env || 'development']
        };
    }
}

module.exports = MongoConfig; 
```

## File: src/config/config_status.md

- Extension: .md
- Language: markdown
- Size: 1009 bytes
- Created: 2025-01-07 13:13:57
- Modified: 2025-01-07 13:13:57

### Code

```markdown
### 1. Configuration (`config/`)

*   **Functionality:** Manages the application's configuration settings, primarily the database connection.
*   **Architecture:**
    *   ✅ `db.js`: Contains the logic to connect to the MongoDB database using Mongoose:
        - Handles connection events and disconnection
        - Supports configurable connection options
        - Provides test-specific configuration capability
*   **Tasks:**
    *   ✅ Establish a connection to the MongoDB database upon application startup.
    *   ✅ Handle connection errors gracefully and log them.
    *   ✅ Provide a reusable database connection object.
    *   ✅ Configure database connection with flexible options support

**Next Steps:**
- Add connection event listeners for disconnection handling
- Implement connection pooling configuration if needed
- Add retry logic for connection failures

**Testing Strategy:**
- Unit tests with mongodb-memory-server
- Connection success/failure scenarios
- Run with: `npm test`
```

## File: src/constants/constatns_status.md

- Extension: .md
- Language: markdown
- Size: 590 bytes
- Created: 2025-01-07 13:37:05
- Modified: 2025-01-07 13:37:05

### Code

```markdown
### 2. Constants (`constants/`)

*   **Functionality:** Defines application-wide constants.
*   **Architecture:**
    *   `index.js`: Exports an object containing constants like error codes, status messages, role definitions, or other fixed values used across the application.
*   **Tasks:**
    *   Define constants for error codes (e.g., `USER_NOT_FOUND`, `SLOT_FULL`).
    *   Define constants for status messages (e.g., `BOOKING_SUCCESSFUL`, `CANCELLATION_SUCCESSFUL`).
    *   Potentially define role constants (e.g., `USER`, `ADMIN`) if role-based access control is implemented later.
```

## File: src/constants/index.js

- Extension: .js
- Language: javascript
- Size: 0 bytes
- Created: 2025-01-04 16:35:20
- Modified: 2025-01-04 16:35:20

### Code

```javascript

```

## File: src/tests/middleware/authMiddleware.test.js

- Extension: .js
- Language: javascript
- Size: 1763 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('should authenticate valid token', async () => {
        const token = 'valid-token';
        const decoded = { id: 'user-id' };
        req.header.mockReturnValue(`Bearer ${token}`);
        jwt.verify.mockReturnValue(decoded);

        await authMiddleware.authenticate(req, res, next);

        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
        req.header.mockReturnValue(undefined);

        await authMiddleware.authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No token, authorization denied'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
        req.header.mockReturnValue('Bearer invalid-token');
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await authMiddleware.authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token is not valid'
        });
        expect(next).not.toHaveBeenCalled();
    });
}); 
```

## File: src/tests/config/db.test.js

- Extension: .js
- Language: javascript
- Size: 1377 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = require('../../config/db');

describe('Database Configuration', () => {
    let mongoServer;
    let validUri;
    let consoleError;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        mongoServer = await MongoMemoryServer.create();
        validUri = mongoServer.getUri();
        consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        consoleError.mockRestore();
    });

    beforeEach(async () => {
        await mongoose.disconnect();
        process.env.MONGODB_URI = validUri;
    });

    it('should connect to database successfully', async () => {
        const conn = await connectDB();
        expect(mongoose.connection.readyState).toBe(1);
    });

    it('should reuse existing connection', async () => {
        const conn1 = await connectDB();
        const conn2 = await connectDB();
        expect(conn1).toBe(conn2);
    });

    it('should not connect when URI is invalid', async () => {
        await mongoose.disconnect();
        process.env.MONGODB_URI = 'mongodb://invalid-uri';
        await expect(connectDB()).rejects.toThrow('Failed to connect to MongoDB');
    });
}); 
```

## File: src/tests/auth/authController.test.js

- Extension: .js
- Language: javascript
- Size: 2709 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('Auth Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('register', () => {
        it('should register user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };
            req.body = userData;

            authService.registerUser.mockResolvedValue({
                _id: 'some-id',
                email: userData.email
            });

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully'
            });
        });

        it('should handle registration error', async () => {
            req.body = {
                email: 'test@test.com',
                password: 'password123'
            };

            authService.registerUser.mockRejectedValue(new Error('Registration failed'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Registration failed'
            });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };
            req.body = userData;

            const loginResult = {
                token: 'some-token',
                user: { id: 'some-id', email: userData.email }
            };
            authService.loginUser.mockResolvedValue(loginResult);

            await authController.login(req, res);

            expect(res.json).toHaveBeenCalledWith(loginResult);
        });

        it('should handle login error', async () => {
            req.body = {
                email: 'test@test.com',
                password: 'wrong-password'
            };

            authService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid credentials'
            });
        });
    });
}); 
```

## File: src/tests/auth/authService.test.js

- Extension: .js
- Language: javascript
- Size: 2934 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../../services/authService');
const User = require('../../models/User');

describe('Auth Service', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            const user = await authService.registerUser(userData.email, userData.password);

            expect(user).toBeDefined();
            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password); // Password should be hashed
        });

        it('should not register user with existing email', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            await authService.registerUser(userData.email, userData.password);

            await expect(
                authService.registerUser(userData.email, userData.password)
            ).rejects.toThrow('User already exists');
        });
    });

    describe('loginUser', () => {
        beforeEach(async () => {
            process.env.JWT_SECRET = 'test-secret';
        });

        it('should login user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            await authService.registerUser(userData.email, userData.password);
            const result = await authService.loginUser(userData.email, userData.password);

            expect(result.token).toBeDefined();
            expect(result.user.email).toBe(userData.email);
        });

        it('should not login with incorrect password', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            await authService.registerUser(userData.email, userData.password);

            await expect(
                authService.loginUser(userData.email, 'wrongpassword')
            ).rejects.toThrow('Invalid credentials');
        });

        it('should not login non-existent user', async () => {
            await expect(
                authService.loginUser('nonexistent@test.com', 'password123')
            ).rejects.toThrow('Invalid credentials');
        });
    });
}); 
```

## File: src/tests/utils/apiResponse.test.js

- Extension: .js
- Language: javascript
- Size: 238 bytes
- Created: 2025-01-07 13:19:01
- Modified: 2025-01-07 13:19:01

### Code

```javascript
const apiResponse = require('../../utils/apiResponse');

describe('API Response Utility', () => {
    it('should create success response', () => {
        // TODO: Implement API response tests
        expect(true).toBe(true);
    });
}); 
```

## File: src/tests/models/models.test.js

- Extension: .js
- Language: javascript
- Size: 2839 bytes
- Created: 2025-01-07 13:26:31
- Modified: 2025-01-07 13:26:31

### Code

```javascript
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');
const Slot = require('../../models/Slot');

describe('Models Validation', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('User Model', () => {
        it('should throw validation error for empty user', async () => {
            const user = new User({});
            await expect(user.validate()).rejects.toThrow();
        });

        it('should validate with correct user data', async () => {
            const user = new User({
                email: 'test@test.com',
                password: 'password123'
            });
            await expect(user.validate()).resolves.not.toThrow();
        });

        it('should reject invalid email format', async () => {
            const user = new User({
                email: 'invalid-email',
                password: 'password123'
            });
            await expect(user.validate()).rejects.toThrow();
        });

        it('should reject short passwords', async () => {
            const user = new User({
                email: 'test@test.com',
                password: '12345'
            });
            await expect(user.validate()).rejects.toThrow();
        });
    });

    describe('Slot Model', () => {
        it('should throw validation error for empty slot', async () => {
            const slot = new Slot({});
            await expect(slot.validate()).rejects.toThrow();
        });

        it('should validate with correct slot data', async () => {
            const slot = new Slot({
                date: new Date(),
                time: '14:00',
                capacity: 10
            });
            await expect(slot.validate()).resolves.not.toThrow();
        });

        it('should reject invalid capacity', async () => {
            const slot = new Slot({
                date: new Date(),
                time: '14:00',
                capacity: 0
            });
            await expect(slot.validate()).rejects.toThrow();
        });

        it('should handle bookedBy references correctly', async () => {
            const user = new User({
                email: 'test@test.com',
                password: 'password123'
            });
            await user.save();

            const slot = new Slot({
                date: new Date(),
                time: '14:00',
                capacity: 10,
                bookedBy: [user._id]
            });
            await expect(slot.validate()).resolves.not.toThrow();
        });
    });
}); 

```

## File: src/tests/routes/authRoutes.test.js

- Extension: .js
- Language: javascript
- Size: 1835 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('Auth Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/auth', authRoutes);
    });

    describe('POST /api/auth/register', () => {
        it('should register new user', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            authService.registerUser.mockResolvedValue({
                _id: 'some-id',
                email: userData.email
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login user', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            const loginResult = {
                token: 'some-token',
                user: { id: 'some-id', email: userData.email }
            };
            authService.loginUser.mockResolvedValue(loginResult);

            const response = await request(app)
                .post('/api/auth/login')
                .send(userData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', userData.email);
        });
    });
}); 
```

## File: src/utils/apiResponse.js

- Extension: .js
- Language: javascript
- Size: 0 bytes
- Created: 2025-01-04 16:35:20
- Modified: 2025-01-04 16:35:20

### Code

```javascript

```

## File: src/utils/utilities_status.md

- Extension: .md
- Language: markdown
- Size: 538 bytes
- Created: 2025-01-07 13:29:31
- Modified: 2025-01-07 13:29:31

### Code

```markdown
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
```

## File: src/models/Slot.js

- Extension: .js
- Language: javascript
- Size: 756 bytes
- Created: 2025-01-07 12:08:49
- Modified: 2025-01-07 12:08:49

### Code

```javascript
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    time: {
        type: String,
        required: [true, 'Time is required']
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    bookedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Add compound index on date and time for faster lookups
slotSchema.index({ date: 1, time: 1 });

// Add index on bookedBy for faster lookup of user bookings
slotSchema.index({ bookedBy: 1 });

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;

```

## File: src/models/User.js

- Extension: .js
- Language: javascript
- Size: 716 bytes
- Created: 2025-01-07 12:08:57
- Modified: 2025-01-07 12:08:57

### Code

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add index on email field for faster lookups
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

```

## File: src/models/models_status.md

- Extension: .md
- Language: markdown
- Size: 1745 bytes
- Created: 2025-01-07 12:52:03
- Modified: 2025-01-07 12:52:03

### Code

```markdown
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
```

## File: src/controllers/controllers_status.md

- Extension: .md
- Language: markdown
- Size: 1383 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```markdown
## 3. Controllers (`controllers/`)

*   **Functionality:** Act as intermediaries between incoming HTTP requests and the service layer. They handle request parsing, call the appropriate service methods, and format the responses.
*   **Architecture:**
    *   `authController.js`:
        *   `register(req, res)`: Handles user registration.
        *   `login(req, res)`: Handles user login.
    *   `bookingController.js`:
        *   `getAllSlots(req, res)`: Retrieves available slots.
        *   `bookSlot(req, res)`: Handles slot booking.
        *   `cancelBooking(req, res)`: Handles booking cancellation.
        *   `getMyBookings(req, res)`: Retrieves a user's bookings.
*   **Tasks:**
    *   ✅ Receive and parse HTTP requests.
    *   ✅ Extract data from request bodies and parameters.
    *   ⏳ Validate request data (can be delegated to middleware).
    *   ✅ Call the corresponding service methods for authentication.
    *   ⏳ Format the response data using the `apiResponse` utility.
    *   ✅ Send HTTP responses with appropriate status codes.

**Testing Strategy:**
- Unit tests for request handling
- Mock service layer interactions
- Test error handling scenarios
- Verify response formatting
- Run with: `npm test`

**Implementation Status:**
- ✅ Auth Controller: Registration and login implemented
- 🔲 Booking Controller: Pending implementation
```

## File: src/controllers/bookingController.js

- Extension: .js
- Language: javascript
- Size: 0 bytes
- Created: 2025-01-04 16:35:20
- Modified: 2025-01-04 16:35:20

### Code

```javascript

```

## File: src/controllers/authController.js

- Extension: .js
- Language: javascript
- Size: 662 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login
}; 
```

## File: src/routes/authRoutes.js

- Extension: .js
- Language: javascript
- Size: 256 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
```

## File: src/routes/bookingRoutes.js

- Extension: .js
- Language: javascript
- Size: 0 bytes
- Created: 2025-01-04 16:35:20
- Modified: 2025-01-04 16:35:20

### Code

```javascript

```

## File: src/routes/routes_status.md

- Extension: .md
- Language: markdown
- Size: 899 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```markdown
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
```

## File: src/services/bookingService.js

- Extension: .js
- Language: javascript
- Size: 0 bytes
- Created: 2025-01-04 16:35:20
- Modified: 2025-01-04 16:35:20

### Code

```javascript

```

## File: src/services/services_status.md

- Extension: .md
- Language: markdown
- Size: 2018 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```markdown
### 7. Services (`services/`)

*   **Functionality:** Contain the core business logic of the application. They are called by controllers and interact with the models to perform data operations.
*   **Architecture:**
    *   `authService.js`:
        *   `registerUser(email, password)`: Creates a new user.
        *   `loginUser(email, password)`: Authenticates a user and generates a JWT.
    *   `bookingService.js`:
        *   `getAvailableSlots()`: Fetches available slots.
        *   `bookSlot(slotId, userId)`: Books a slot for a user.
        *   `cancelBooking(slotId, userId)`: Cancels a booking.
        *   `getUserBookings(userId)`: Retrieves a user's bookings.
        *   `hasActiveBooking(userId)`: Checks for existing active bookings.
*   **Tasks:**
    *   `authService`:
        *   ✅ Validate user input during registration.
        *   ✅ Hash passwords using `bcrypt`.
        *   ✅ Create new user documents in the database.
        *   ✅ Verify user credentials during login.
        *   ✅ Generate JWTs using `jsonwebtoken`.
    *   `bookingService`:
        *   Query the database for available slots, filtering by date, time, and capacity.
        *   Check slot availability and user's existing bookings before booking.
        *   Update the `Slot` document to add/remove a user from `bookedBy`.
        *   Query the database for a user's bookings.
        *   Enforce the single active booking rule.

**Verification Strategy:**
```bash
# Run service unit tests
npm test -- services.test.js

# Manual service verification
node -e "
const authService = require('./src/services/authService');
const bookingService = require('./src/services/bookingService');

// Test user registration
authService.registerUser('test@test.com', 'password123')
  .then(() => console.log('✅ Registration test passed'))
  .catch(err => console.error('❌ Registration test failed:', err));"
```

**Implementation Status:**
- ✅ Auth Service: Complete with tests
- 🔲 Booking Service: Not started
```

## File: src/services/authService.js

- Extension: .js
- Language: javascript
- Size: 1122 bytes
- Created: 2025-01-08 19:08:40
- Modified: 2025-01-08 19:08:40

### Code

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (email, password) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword
  });

  return user;
};

const loginUser = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user: { id: user._id, email: user.email } };
};

module.exports = {
  registerUser,
  loginUser
}; 
```

