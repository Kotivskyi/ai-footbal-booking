# Football Slot Booking Backend

REST API backend for managing football field bookings and user authentication.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

## Prerequisites

- Node.js v18.12.1 or higher
- npm v9.8.1 or higher
- MongoDB 6.0 or higher (local or cloud instance)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/football-booking-system.git
cd football-booking-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Install development dependencies (for testing):
```bash
npm install --only=dev
```

## Configuration

1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Update environment variables (see [Environment Variables](#environment-variables))

## Running the Application

Start in development mode (with nodemon):
```bash
npm run dev
```

Start in production mode:
```bash
npm start
```

## Testing

Run all tests:
```bash
npm test
```

Run unit tests only:
```bash
npm run test:unit
```

Run integration tests:
```bash
npm run test:int
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/booking` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your_jwt_secret_here` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Application environment | `development` or `production` |

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database and environment configuration
│   ├── controllers/    # Request handlers
│   ├── models/         # MongoDB models
│   ├── routes/         # Express route definitions
│   ├── services/       # Business logic
│   ├── middleware/     # Authentication and validation
│   └── utils/          # Helper functions
├── tests/              # Test suites
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── .env.example        # Environment template
└── package.json        # Project dependencies
```

## API Documentation

For detailed API documentation and endpoints, refer to [API_DOCS.md](API_DOCS.md).

## License

This project is licensed under the [MIT License](LICENSE). 