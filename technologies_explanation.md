# AI Environmental Impact Analyzer - Technology Stack

This document provides a detailed explanation of the technologies used across the **Frontend**, **Backend**, and **Web3/Blockchain** layers of the AI Environmental Impact Analyzer project, along with the reasoning behind their selection.

---

## 1. Frontend Technologies

The frontend is built as a modern, responsive, and highly interactive web application designed to provide a premium user experience.

### Core Framework
*   **Next.js (v16) & React (v19)**
    *   **Why**: Next.js is a powerful React framework that offers Server-Side Rendering (SSR) and Static Site Generation (SSG). This ensures fast page loads, excellent SEO (crucial for a public-facing application), and an optimized user experience. React provides a robust component-based architecture for building reusable UI elements.
*   **TypeScript**
    *   **Why**: Adds static typing to JavaScript, reducing runtime errors, improving code maintainability, and providing excellent developer tooling and autocomplete.

### Styling & UI
*   **Tailwind CSS (v3.4)**
    *   **Why**: A utility-first CSS framework that allows for rapid UI development without writing custom CSS files. It ensures a consistent design system and makes it easy to implement responsive layouts and dark mode.
*   **Framer Motion**
    *   **Why**: A production-ready animation library for React. It is used to implement dynamic micro-animations, smooth page transitions, and interactive elements that give the application a premium, dynamic feel.
*   **Lucide React**
    *   **Why**: A comprehensive library of clean, modern SVG icons that integrate seamlessly with React and Tailwind CSS.
*   **clsx & tailwind-merge**
    *   **Why**: Utilities for conditionally joining class names and intelligently merging Tailwind classes without style conflicts, making component styling highly flexible.

### Data Fetching & State Management
*   **Axios**
    *   **Why**: A promise-based HTTP client used to make requests to the backend API. It handles JSON data automatically and provides features like interceptors for attaching authentication tokens.
*   **js-cookie & jwt-decode**
    *   **Why**: Used for client-side authentication management. `js-cookie` securely manages session cookies, while `jwt-decode` parses JSON Web Tokens to extract user information on the frontend without needing a backend request.

---

## 2. Backend Technologies

The backend serves as the core engine of the application, handling user authentication, database operations, and the integration with Artificial Intelligence.

### Core Environment
*   **Node.js & Express.js (v5.2)**
    *   **Why**: Node.js allows writing backend code in JavaScript, unifying the language across the stack. Express.js is a minimal and flexible web framework that makes it easy to build robust RESTful APIs, define routes, and manage middleware.

### Database
*   **MongoDB & Mongoose (v9.3)**
    *   **Why**: MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. This is ideal for an application dealing with varied product information and analysis results. Mongoose provides a straight-forward, schema-based solution to model application data, offering built-in type casting and validation.

### Artificial Intelligence
*   **Google Generative AI (Gemini API)**
    *   **Why**: The `@google/generative-ai` SDK connects the backend to Google's Gemini models. This is the core intelligence of the application, used to analyze product descriptions, manufacturing details, and supply chains to generate the environmental footprint score.

### Security & Authentication
*   **jsonwebtoken (JWT)**
    *   **Why**: Used to generate secure, stateless authentication tokens. Once a user logs in, they receive a JWT, which is then used to authorize subsequent requests to protected API endpoints.
*   **bcryptjs**
    *   **Why**: A library for hashing passwords before storing them in the database. This ensures that user credentials remain secure even in the event of a data breach.
*   **CORS (Cross-Origin Resource Sharing)**
    *   **Why**: Middleware to securely allow the frontend (running on a different port/domain during development or production) to communicate with the backend API.

### Utilities
*   **Nodemailer**
    *   **Why**: A module for sending emails from the Node.js application, typically used for user verification, password resets, or notifications.
*   **Dotenv**
    *   **Why**: Keeps sensitive configuration variables (like database URIs, API keys, and JWT secrets) out of the codebase by loading them from a `.env` file.

---

<!-- ## 3. Web3 & Blockchain Technologies (Project Root)

Because this is a decentralized application aimed at transparency, it incorporates blockchain technology to ensure data immutability and trust. -->

<!-- ### Smart Contract Development
*   **Hardhat & Ethers.js**
    *   **Why**: Hardhat is an Ethereum development environment for compiling, deploying, testing, and debugging smart contracts. Ethers.js is a library for interacting with the Ethereum blockchain and its ecosystem.
*   **OpenZeppelin Contracts**
    *   **Why**: A library of secure, standard smart contract implementations (like ERC tokens, access control). It prevents reinventing the wheel and minimizes security vulnerabilities.
*   **Chainlink Contracts**
    *   **Why**: Provides access to decentralized oracle networks, allowing smart contracts to securely interact with real-world data, external APIs, and off-chain computation.

### Decentralized Storage
*   **IPFS (InterPlanetary File System), Pinata & Arweave**
    *   **Why**: These tools are used for decentralized file storage. Instead of storing product images or extensive reports on centralized servers, they are pinned to IPFS/Arweave, ensuring they cannot be arbitrarily altered or deleted, maintaining the integrity of the environmental impact reports. -->

---

## 4. Data Models & Storage (MongoDB)

The application utilizes MongoDB to store and manage data in a flexible document-based format. The core data models include:

*   **User Profiles**: Manages account details, encrypted passwords, user roles (Admin vs. Regular User), and gamification progress including total eco-points, levels, and earned badges.
*   **Environmental Behavior Logs**: Stores the heart of the application's data—user inputs for electricity, water, and travel, as well as the structured JSON output from the Gemini AI (footprint scores and tailored recommendations).
*   **Educational Articles**: Contains community or admin-submitted articles for the Learning Hub, tracking their content, authorship, and moderation status.
*   **Quiz Repository**: Stores awareness-building questions, multiple-choice options, correct answers with explanations, and the associated points awarded to users for participation.
