# Environmental Footprint Analysis: Technical & Functional Documentation

This document provides a comprehensive overview of how the **Ai-Environmental-Impact-Analyzer** calculates environmental footprints, the underlying AI logic, and the system's behavior regarding user data and gamification.

---

## 1. Core Calculation Engine (AI-Powered)
Unlike traditional calculators that use fixed coefficients, this project leverages **Generative AI** to provide a nuanced, context-aware analysis.

*   **Technology**: Google Gemini AI (`gemini-flash-latest`).
*   **Methodology**: The system uses **Prompt Engineering** to transform raw user data into a structured environmental report. The AI evaluates the combination of all inputs (e.g., how travel distance interacts with diet type) to provide a holistic score.

---

## 2. Input Parameters (Related Entries)
The calculation is based on 6 key behavioral metrics submitted by the user:

| Entry Field | Unit / Type | Description |
| :--- | :--- | :--- |
| **Electricity Usage** | kWh | Weekly/Monthly power consumption. |
| **Water Usage** | Liters | Weekly/Monthly water consumption. |
| **Waste Generation** | kg | Physical waste produced. |
| **Travel Distance** | km | Distance covered during the period. |
| **Travel Mode** | String | Category: Car, Bus, Train, Bike, or Walk. |
| **Diet Type** | String | Category: Vegan, Vegetarian, High Meat, or Low Meat. |

---

## 3. Output & Results
The system generates a structured JSON response consisting of:

1.  **Footprint Score (1-100)**: 
    *   **1-30 (Green)**: Low impact, sustainable lifestyle.
    *   **31-70 (Yellow)**: Moderate impact, needs improvement.
    *   **71-100 (Red)**: High impact, unsustainable behavior.
2.  **Key Findings**: 3 specific bullet points explaining *why* the score was given (e.g., "High meat consumption is significantly driving up your carbon footprint").
3.  **Personalized Alternatives**: 3 actionable recommendations to reduce the footprint (e.g., "Switching to a bike for commutes under 5km could lower your score by 15 points").

---

## 4. The Working Process (Step-by-Step)

### Step 1: User Submission
The user fills out the analysis form on the frontend. The data is sent via a `POST` request to `/api/analyze`.

### Step 2: Prompt Construction
The backend controller (`analysisController.js`) constructs a strict instructional prompt:
```text
Analyze the following behavior:
- Electricity: [Value] kWh
- Water: [Value] L
...
TASK: Generate a footprintScore (1-100), keyFindings, and alternatives.
Format as valid RAW JSON.
```

### Step 3: AI Processing & JSON Trapping
Gemini processes the prompt. Since AI can sometimes return conversational text, the backend uses **Aggressive JSON Trapping** (Regex) to extract only the valid JSON object, ensuring system stability.

### Step 4: Data Persistence
The result is saved to the **MongoDB** `BehaviorLog` collection. This log links the analysis to the specific `userId` and includes a timestamp.

---

## 5. System Behavior & Logic

### A. Gamification & Leveling
To encourage sustainable behavior, the system includes a reward mechanism:
*   **Points**: Every time a user performs an analysis, they earn **+10 Points**.
*   **Leveling Formula**: `Level = Math.floor(TotalPoints / 50) + 1`.
*   **Behavior**: Users "Level Up" for every 5 analyses completed.

### B. History Management (Soft Delete)
*   **User Action**: When a user "deletes" a history entry, the system performs a **Soft Delete**.
*   **Logic**: The `isHiddenForUser` flag is set to `true`. 
*   **Result**: The entry disappears from the user's dashboard but remains in the database for **Admin Analytics**, allowing the platform to track global environmental trends without losing data.

### C. Role-Based Access
*   **Standard Users**: Can only view and manage their own history.
*   **Admins**: Can view all history entries across all users to visualize the platform's overall environmental impact.

---

## 6. Database Schema Reference (BehaviorLog)
```javascript
{
  userId: ObjectId,           // Owner of the log
  electricityUsage: Number,
  waterUsage: Number,
  wasteGeneration: Number,
  travelDistance: Number,
  travelMode: String,
  dietType: String,
  footprintScore: Number,     // AI Generated
  analysisDetails: {          // AI Generated
    keyFindings: Array,
    alternatives: Array
  },
  isHiddenForUser: Boolean,   // Soft delete flag
  createdAt: Date             // Timestamp
}
```


npm install