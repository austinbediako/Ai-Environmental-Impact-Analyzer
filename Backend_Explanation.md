# Backend Explanation

This document explains the architecture, components, and working mechanism of the backend for the AI Environmental Impact Analyzer project.

## 1. Technology Stack
- **Node.js & Express.js**: The core framework used to build the RESTful API. Express provides a robust set of features for web and mobile applications, handling routing, middleware, and HTTP requests.
- **MongoDB & Mongoose**: A NoSQL database is used to store unstructured data flexibly. Mongoose acts as an Object Data Modeling (ODM) library, providing a rigorous modeling environment for MongoDB.
- **Google Generative AI (Gemini API)**: Integrated to perform intelligent analysis on user behavior and calculate environmental footprints.
- **JWT (JSON Web Tokens)**: Used for secure stateless authentication.
- **Bcrypt.js**: Used for hashing user passwords securely before storing them in the database.

## 2. Directory Structure & Working

### `server.js` (Entry Point)
This is the main entry point of the backend application. It:
1. Initializes the Express application.
2. Connects to the MongoDB database using configuration from `config/db.js`.
3. Sets up global middleware like `cors` (Cross-Origin Resource Sharing) and `express.json()` (to parse JSON bodies).
4. Registers the main route handlers (e.g., `/api/auth`, `/api/admin`, `/api`).
5. Starts the server to listen on a designated port.

### `models/` (Data Models)
Defines the schema for how data is stored in MongoDB using Mongoose.
- **`User.js`**: Stores user credentials, roles (admin/user), and their accumulated eco-scores.
- **`Article.js`**: Stores educational content used in the learning module.
- **`QuizQuestion.js`**: Stores questions, options, and correct answers for quizzes.
- **`BehaviorLog.js`**: Tracks the actions and inputs of users when they analyze their environmental impact.

### `controllers/` (Business Logic)
Contains the core logic for the application. Each controller handles specific features:
- **`authController.js`**: Manages user registration, login, password hashing, and issues JWT tokens for session management.
- **`analysisController.js`**: This is a critical component. It takes user input regarding their daily activities, communicates with the **Gemini AI API**, and returns a detailed analysis of their carbon footprint and actionable recommendations.
- **`learningController.js`**: Handles the retrieval of educational articles, manages quiz submissions, and calculates scores.
- **`adminController.js`**: Provides administrative functions like viewing platform statistics, managing users, and adding/editing learning materials.

### `routes/` (API Endpoints)
Maps HTTP requests (GET, POST, PUT, DELETE) to the appropriate controller functions.
- **`authRoutes.js`**: Maps `/login` and `/register`.
- **`adminRoutes.js`**: Maps endpoints restricted to admin users.
- **`api.js` & `learningRoutes.js`**: Maps general endpoints for analysis and the learning hub.

### `middleware/`
Contains functions that intercept requests before they reach the controllers.
- **Auth Middleware**: Verifies the JWT token in the request headers to ensure the user is logged in.
- **Admin Middleware**: Checks if the authenticated user has administrative privileges before allowing access to admin routes.

## 3. Workflow Example: User Analysis Request
1. **Request**: The frontend sends a POST request to `/api/analyze` with the user's daily activity data.
2. **Middleware**: The authentication middleware intercepts the request, verifies the JWT token, and attaches the user's ID to the request object.
3. **Route**: The route forwards the request to the `analysisController.js`.
4. **Controller logic**: 
   - The controller prepares a prompt containing the user's data.
   - It sends this prompt to the Google Gemini AI model.
   - Once the AI responds with the footprint calculation and recommendations, the controller saves this interaction in the `BehaviorLog` model.
   - The controller sends the AI's response back to the frontend as a JSON object.
