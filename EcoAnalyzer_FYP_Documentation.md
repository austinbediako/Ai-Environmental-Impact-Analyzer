<!-- # FINAL YEAR PROJECT

## Ai-Environmental-Impact-Analyzer: AI-Powered Environmental Footprint Assessment Application

**Supervised By**  
[Supervisor Name]  

**By**  
Iqra Nazim - Project Lead Frontend Developer  
Ezzah Khan - Backend Developer  
Amina Hassan - Frontend, Designs and Documentation  

**DEPARTMENT OF [YOUR DEPARTMENT]**  
[Your University Name], PAKISTAN  
2021-2025  

---

## DEDICATION
This project is dedicated to those who envision a future where technology works effortlessly to protect our planet, empowering people to make sustainable choices. It is for the dreamers who see innovation as a natural part of everyday life, and for the creative minds who transform ideas into reality. EcoAnalyzer was built with dedication, passion, and countless hours of hard work. We remember the late nights, the brainstorming sessions, and the moments of challenge that inspired us to push beyond our limits. To our families and friends—your unwavering support, encouragement, and belief in us gave us the strength to keep going.

With heartfelt gratitude,  
**The EcoAnalyzer Team**  
*Iqra Nazim, Ezzah Khan, Amina Hassan*

---

## DECLARATION
We hereby declare that the development of the **Ai-Environmental-Impact-Analyzer** and the preparation of this accompanying report are the results of our own independent work and personal efforts. No part of the application, its source code, design, or documentation has been copied from any other project, nor has it been submitted previously for the award of any qualification or degree at this or any other university, institution, or organization. All references, resources, API integrations, and external contributions used in the course of this project have been properly acknowledged.

**Iqra Nazim** ________________  
**Ezzah Khan** ________________  
**Amina Hassan** ________________  

[Date: August, 2025]  

---

## CERTIFICATE OF APPROVAL
It is to certify that the final year project "Ai-Environmental-Impact-Analyzer" was developed by Iqra Nazim, Ezzah Khan, and Amina Hassan at [Your University Name] under the supervision of [Supervisor Name] and that in their opinion, it is in scope, fully adequate, and of the quality required for the degree.

**Supervisor:**  
-----------------------------------------  
[Supervisor Name]  
[Supervisor Title]  

**HOD/Chairperson:**  
-----------------------------------------  
[HOD Name]  
Chairperson  

---

## ACKNOWLEDGEMENT
In the name of Allah, the Most Merciful and Beneficent. We are grateful to Allah Almighty for guiding us through each stage. This project necessitated a great deal of effort, patience, and attention. First and foremost, we appreciate our supervisor, [Supervisor Name], for giving us the essential advice, continual support, and inspiration. We sincerely thank our parents, families, and friends for all support, encouragement, and patience. We would also like to acknowledge the efforts and knowledge of [University Name] staff, professors, and instructors who provide us with the help, support, and guidance throughout the academic period.

---

## ABSTRACT
The **Ai-Environmental-Impact-Analyzer** is a web-based artificial intelligence platform designed to assess, score, and minimize the environmental footprint of everyday products and materials. In today's climate-conscious market, consumers and businesses desperately need transparent, technology-driven solutions to evaluate the sustainability of items before purchasing or manufacturing.

EcoAnalyzer addresses this need by providing a high-performance web application featuring a **Next.js** frontend and a highly scalable **Node.js/Express** backend, seamlessly communicating with a **MongoDB** database for secure user authentication and history tracking. The platform natively integrates the cutting-edge **Google Gemini AI API** to analyze product descriptions, generating an immediate "Environmental Footprint Score," identifying harmful components, and intelligently suggesting eco-friendly alternatives. 

The application offers dedicated User and Admin Dashboards. Users can review past environmental searches to track their sustainable journey, while Administrators possess granular control over platform analytics to visualize overall eco-trends. The project emphasizes agility, scalable deployment, and environmental awareness, serving as a modern approach to bridge the gap between AI-driven technology and global sustainability.

---

## TABLE OF CONTENTS
1. [Chapter 1: Introduction](#chapter-1-introduction)
2. [Chapter 2: General Description](#chapter-2-general-description)
3. [Chapter 3: Specific Requirements](#chapter-3-specific-requirements)
4. [Chapter 4: Analysis Models](#chapter-4-analysis-models)
5. [Chapter 5: Testing & Conclusion](#chapter-5-testing--conclusion)
6. [Appendices](#appendices)

---

## Chapter 1: Introduction

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) is to formally define the requirements for the development of EcoAnalyzer. This document acts as a mutual agreement between developers, project managers, and end-users regarding expected functionality, performance, and usability.

### 1.1.1 Addressing a Pressing Need
The primary purpose of EcoAnalyzer is to address a critical gap in sustainable consumption. Many buyers struggle to identify the actual environmental cost of products. EcoAnalyzer bridges this gap by offering instant AI-generated environmental impact scores mathematically and semantically verified by Gemini AI.

### 1.1.2 Empowering Consumers
EcoAnalyzer offers:
- AI-generated Footprint Scores.
- Breakdown of negative component impacts.
- Suggestion of eco-friendly and sustainable alternatives.

### 1.1.3 Streamlining the Data for Administrators
The platform offers an Admin Dashboard where administrators can monitor global search frequencies, identify which products are analyzed the most, and control platform user enrollment natively without relying on raw database manipulation.

### 1.2 Scope
The scope encompasses a Full-Stack web application utilizing Next.js (React), Node.js, Express, and MongoDB. It focuses exclusively on textual product descriptions and leveraging language model AI arrays to summarize the manufacturing, usage, and disposal impact of the queried product.

### 1.3 Definitions, Acronyms, and Abbreviations
- **Footprint Score:** A quantitative value (0-100) dynamically generated indicating the negative environmental consequences of a product. (Lower=Better, or depending on scale).
- **Gemini AI:** Google's multimodal artificial intelligence model used to parse text and return sustainable metrics.
- **JWT:** JSON Web Token used for secure, stateless session authentication.
- **REST API:** Representational State Transfer, representing the architectural style used for the backend to communicate with the Next.js frontend.

---

## Chapter 2: General Description

### 2.1 Product Perspective
EcoAnalyzer is an independent, standalone web-based platform. While originally designed for desktop utilization due to complex data analysis dashboards, its utilization of Tailwind CSS allows it to scale perfectly to mobile and tablet interfaces smoothly. 

### 2.2 Product Functions
- **AI Footprint Generation:** Pass product names into the AI and receive detailed environmental reports and alternative suggestions.
- **History Tracking:** All authenticated users possess a local repository containing every search made, allowing long-term review of analyzed products.
- **Role-Based Authentication:** Dynamic JWT checks partition user capabilities. Standard users evaluate products; Administrators oversee users and global history data.
- **Dark/Light Mode:** Full integration of high-quality UI/UX theme switching to accommodate all visual preferences.

### 2.3 User Characteristics
- **Standard Users:** Eco-conscious consumers, corporate purchasers, or researchers needing rapid environmental data.
- **Administrators:** Platform managers responsible for overseeing user growth, removing malicious accounts, and ensuring continuous platform health.

### 2.4 General Constraints
- **API Dependency:** The application’s core computational logic is completely reliant on the uptime and availability of the Google Gemini AI API.
- **Internet Dependency:** Offline mode is not supported as AI calculation and MongoDB storage require active networking.

---

## Chapter 3: Specific Requirements

### 3.1 External Interface Requirements
#### 3.1.1 User Interfaces
- **Responsive Layout:** Adaptive layouts ensuring functionality across Web, Mobile, and Tablet.
- **Gamification Elements:** Dynamic charting and color-coded status pills indicating score severity (Green = Good, Red = Bad).

#### 3.1.2 Software Interfaces
- **Database:** MongoDB Atlas (Cloud NoSQL document structure).
- **Authentication:** Custom JWT-based stateless mechanisms handling persistent login.
- **Frameworks:** React/Next.js (TSX) for views, Express.js for local API routing.

### 3.2 Functional Requirements

#### 3.2.1 Registration & Login
Users access the platform through an intuitive, streamlined 1-step signup or login framework. Passwords are mathematically hashed natively using Bcrypt inside the Node Controllers to protect data integrity before striking the Mongoose ORM.

#### 3.2.2 Analyzing Output
Users submit a query string (e.g., "Plastic Water Bottle"). The backend wraps the query in a strict instructional prompt dictating to Gemini AI to return structured JSON parsing the Footprint Score, Breakdown, and Alternatives. The JSON is extracted and injected into the dynamic UI components.

#### 3.2.3 Admin Creation Workflow
From the secure Administrative Dashboard, top-level admins maintain the jurisdiction to manually forge new Administrators into the database securely bypassing traditional user registration routes.

### 3.3 Use Cases
**UC-01:** User Submits Product 
- **Action:** Triggers POST to `/api/analyze`.
- **System:** Calls Gemini AI, formats JSON, saves to MongoDB `Entry` Model linked to `User` ID.
- **Result:** Renders response on screen and updates sidebar historical cache.

**UC-02:** Admin Reviews Global Data
- **Action:** Admin navigates to `/admin`.
- **System:** Verifies JWT token and `admin` role boundary. Fetches all users and all entries via `adminController.js`.
- **Result:** Populates holistic tables for review.

---

## Chapter 4: Analysis Models

### 4.1 Sequence Flow
1. **Frontend (Next.js)** sends a Query payload containing a JWT token.
2. **Backend (Express)** middleware (`protect`) validates the token.
3. Backend controller fires HTTPS requests to **Google Gemini**.
4. Data is reformatted securely and intercepted.
5. Save operation fires to **MongoDB**.
6. Response terminates correctly returning Payload to Client to hydrate React DOM.

---

## Chapter 5: Testing & Conclusion

### 5.1 Testing Vectors
- **Functional Testing:** Ensuring AI correctly refuses irrelevant queries (e.g., stopping users from using the AI as a general chatbot).
- **Security Testing:** Verifying standard users are violently rejected by `adminMiddleware.js` if they attempt to fetch global analytics.
- **Performance Testing:** Analyzing latency created by Gemini API calls to ensure user feedback loops (loading spinners) behave organically.

### 5.2 Conclusion
The **Ai-Environmental-Impact-Analyzer** successfully fulfills the overarching objective of merging artificial intelligence with environmental awareness. By offering a meticulously crafted frontend connected to a highly robust MVC backend, the application scales effortlessly. The utilization of standard REST models mixed with external AI integrations showcases modern engineering resilience, ensuring users can consistently identify sustainable practices moving forward.

---

## Appendices

### A.1 Screenshots
*(Note: Replace these placeholders with actual screenshots from your working output)*

- **A.1.1** Application Landing & About Page Vector
- **A.1.2** Registration & Login Screen UI (Light/Dark Theme)
- **A.1.3** AI Product Analyzer Dashboard showing Input Field and Sidebar
- **A.1.4** Result Output highlighting Score, Breakdown and Alternatives!
- **A.1.5** Admin Dashboard viewing global platform history traffic. -->
