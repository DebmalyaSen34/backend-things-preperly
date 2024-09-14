# Index.js File Explanation

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

This file is the entry point of the application, responsible for setting up the Express.js framework, connecting to the database, and defining routes for the API.

## Importing NPM packages

The file starts by importing the necessary NPM packages:

- `express`: The Express.js framework for building web applications.
- `session`: The `express-session` package for managing user sessions.
- `MongoStore`: The `connect-mongo` package for storing session data in a MongoDB database.
- `configDotenv`: The dotenv package for loading environment variables from a .env file.
- `cookieParser`: The cookie-parser package for parsing cookies in HTTP    requests.

## Importing Defined Files

The file then imports several defined files:

- `router`: The router file for client routes.
- `vendorRouter`: The router file for vendor routes.
- `connectToDatabase`: The file for connecting to the MongoDB database.
- `Auth`: The middleware file for authenticating cookies.

## Setting up Middleware

The file sets up several middlewares:

### Cookie Parser Middleware
- `app.use(cookieParser())`: This middleware parses cookies in HTTP requests.

### Session Middleware
- `app.use(session({...}))`: This middleware sets up the session management system. It uses the `MongoStore` package to store session data in a MongoDB database. The session configuration includes:
    - `secret`: The secret key for signing session cookies.
    - `resave`: A flag indicating whether to resave the session even if it hasn't changed.
    - `saveUninitialized`: A flag indicating whether to save uninitialized sessions.
    - `store`: The MongoDB store for session data.
    - `cookie`: The configuration for the session cookie.
### JSON Parsing Middleware
- `app.use(express.json())`: This middleware parses JSON request bodies.
### Authentication Middleware
- `app.use(Auth)`: This middleware authenticates cookies using the `Auth` middleware file.

## Defining Routes

The file defines several routes:

### Main Route
- `app.get('/', (req, res) => {...})`: This route responds to GET requests to the root URL (`/`) with a JSON response.
### API Routes
- `app.use('/api', router)`: This route mounts the client routes defined in the `router` file.
- `app.use('/vendor', vendorRouter)`: This route mounts the vendor routes defined in the `vendorRouter` file.

## Connecting to the Database

The file connects to the MongoDB database using the `connectToDatabase()` function. If the connection is successful, it starts the server by calling `app.listen(PORT, ...)`. If the connection fails, it logs an error message and exits the process.

## Environment Configuration

The file loads environment variables from a `.env` file using the `configDotenv()` function.

## PORT Configuration

The file sets the PORT environment variable to either the value of `process.env.PORT` or 3000 if it is not set.