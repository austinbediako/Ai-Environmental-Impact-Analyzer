# Frontend Explanation

This document explains the architecture, components, and working mechanism of the frontend for the AI Environmental Impact Analyzer project.

## 1. Technology Stack
- **Next.js (App Router)**: A powerful React framework that enables server-side rendering, static site generation, and optimized performance. The project uses the modern App Router (`src/app` directory).
- **React.js**: The core library for building user interfaces using component-based architecture.
- **Tailwind CSS**: A utility-first CSS framework used for rapidly building custom, responsive, and modern user interfaces without leaving HTML/JSX.
- **Framer Motion**: Used for adding smooth animations and transitions to improve user engagement and aesthetic appeal.
- **Axios**: A promise-based HTTP client used to make requests to the backend API.
- **Lucide React**: Used for beautiful and consistent SVG icons across the application.

## 2. Directory Structure & Architecture

The frontend is contained within the `frontend/` directory, with the main application logic inside `src/`.

### `src/app/` (Routing & Pages)
Next.js uses file-system-based routing. Each folder inside `src/app` represents a route, and the `page.tsx` file within it defines the UI for that route.
- **`/ (page.tsx)`**: The landing page. Introduces the application, its features, and provides a call to action to start analyzing.
- **`/login` & `/signup`**: Authentication pages where users can create an account or log in. These pages handle form state and communicate with the backend auth endpoints.
- **`/analyze`**: The core application page. It presents a dynamic form where users input their activities (transportation, energy usage, diet). Upon submission, it calls the backend analysis endpoint and displays the AI-generated report using visually appealing charts or cards.
- **`/learning`**: The educational hub. Displays articles and interactive quizzes to help users understand environmental concepts.
- **`/leaderboard`**: A gamification feature showing the top users with the most eco-friendly behaviors.
- **`/admin`**: A protected dashboard for administrators to monitor user statistics and manage content.
- **`/settings`**: Allows users to manage their profile and preferences.
- **`layout.tsx`**: The root layout that wraps all pages. It typically includes the global navigation bar (`Navbar`) and sets up global providers.

### `src/components/` (Reusable UI Elements)
Contains modular React components that are used across multiple pages to keep the code DRY (Don't Repeat Yourself).
- Examples might include `Navbar`, `Footer`, `Button`, `Card`, `Modal`, and specific components for displaying the AI analysis results or quiz questions.

### `src/context/` (State Management)
Contains React Context providers for managing global state.
- **`AuthContext`**: Manages the user's authentication state globally. It stores the JWT token (often in cookies or local storage) and provides functions to login, logout, and check if a user is currently authenticated across any component in the app.

### `src/lib/` (Utilities)
Contains helper functions, API configuration, and constants.
- Might include an Axios instance pre-configured with the backend base URL and interceptors to attach the JWT token to outgoing requests.

## 3. Workflow Example: User Login
1. **User Input**: The user navigates to `/login` and enters their email and password.
2. **Form Submission**: The frontend captures the input and uses Axios to send a POST request to the backend's `/api/auth/login` endpoint.
3. **Response Handling**:
   - If successful, the backend returns a JWT token.
   - The frontend's `AuthContext` saves this token (e.g., using `js-cookie`) and updates the global state to indicate the user is logged in.
   - The user is redirected (using Next.js `useRouter`) to the `/analyze` or dashboard page.
4. **Subsequent Requests**: For any future API calls (like fetching user data or running an analysis), the frontend automatically attaches this stored JWT token to the `Authorization` header so the backend knows the request is authenticated.
