# PlantUML Diagrams for AI Environmental Impact Analyzer

This document contains PlantUML code for various diagrams representing the system architecture, flow, and components of the AI Environmental Impact Analyzer project. You can copy these code blocks and render them using a PlantUML viewer (like the VS Code extension or the online PlantUML server).

## 1. Use Case Diagram
Shows the system's actors and their interactions with the system.

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor User
actor Admin

rectangle "AI Environmental Impact Analyzer" {
  User -- (Register/Login)
  User -- (Input Activity Data)
  User -- (View AI Analysis & Recommendations)
  User -- (Read Educational Articles)
  User -- (Take Quizzes)
  User -- (View Leaderboard)
  
  (Input Activity Data) .> (View AI Analysis & Recommendations) : include
  
  Admin -- (Login)
  Admin -- (View Platform Statistics)
  Admin -- (Manage Users)
  Admin -- (Manage Learning Materials)
}
@enduml
```

## 2. Entity Relationship Diagram (ERD)
Visualizes the database schema and relationships between collections in MongoDB.

```plantuml
@startuml
entity "User" as user {
  * _id : ObjectId
  --
  * username : String
  * email : String
  * passwordHash : String
  * role : String (user/admin)
  * ecoScore : Number
  createdAt : Date
}

entity "BehaviorLog" as log {
  * _id : ObjectId
  --
  * userId : ObjectId <<FK>>
  * activityData : Object
  * aiAnalysis : String
  * carbonFootprint : Number
  createdAt : Date
}

entity "Article" as article {
  * _id : ObjectId
  --
  * title : String
  * content : String
  * author : String
  createdAt : Date
}

entity "QuizQuestion" as quiz {
  * _id : ObjectId
  --
  * question : String
  * options : Array<String>
  * correctAnswer : String
  * points : Number
}

user ||--o{ log : "has many"
@enduml
```

### Data Dictionary
While the ERD visually shows the relationships and fields, a Data Dictionary provides a tabular breakdown of the database schema. You can include these tables in your project documentation.

#### Collection: User
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for the user |
| `username` | String | Required | Display name of the user |
| `email` | String | Required, Unique | User's email address for login |
| `passwordHash` | String | Required | Encrypted password |
| `role` | String | Default: 'user' | Defines permissions (`user` or `admin`) |
| `ecoScore` | Number | Default: 0 | User's accumulated gamification points |
| `createdAt` | Date | Auto-generated | Timestamp of account creation |

#### Collection: BehaviorLog
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for the log |
| `userId` | ObjectId | Foreign Key | References the `User` collection |
| `activityData` | Object | Required | JSON object containing transport, diet, energy data |
| `aiAnalysis` | String | Required | The generated feedback from Gemini API |
| `carbonFootprint`| Number | Required | The calculated numeric footprint value |
| `createdAt` | Date | Auto-generated | Timestamp of the analysis request |

#### Collection: Article
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for the article |
| `title` | String | Required | Title of the educational article |
| `content` | String | Required | Main body text/markdown of the article |
| `author` | String | Optional | Admin or author who created it |
| `createdAt` | Date | Auto-generated | Timestamp of creation |

#### Collection: QuizQuestion
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique identifier for the question |
| `question` | String | Required | The quiz question text |
| `options` | Array<String> | Required, min 2 | List of possible answers |
| `correctAnswer` | String | Required | The exact string matching the correct option |
| `points` | Number | Default: 10 | Points awarded for a correct answer |

## 3. Data Flow Diagram (Level 0 Context Diagram)
Shows the high-level flow of information between the system and external entities. PlantUML doesn't have a strict DFD mode, but we can represent it using components.

```plantuml
@startuml
!define DFD_COMPONENT component

DFD_COMPONENT "User" as UserEntity
DFD_COMPONENT "Admin" as AdminEntity
DFD_COMPONENT "Gemini AI API" as Gemini
DFD_COMPONENT "Database" as DB

rectangle "AI Environmental Impact Analyzer System" as System {
}

UserEntity --> System : User Credentials, Activity Data, Quiz Answers
System --> UserEntity : Auth Token, AI Reports, Leaderboard, Articles
AdminEntity --> System : Content Updates, User Management actions
System --> AdminEntity : System Stats
System <--> Gemini : Prompts (Activity Data) / AI Analysis Response
System <--> DB : Read/Write Application Data
@enduml
```

### Data Flow Diagram (Level 1)
Breaks down the main system into primary sub-processes.

```plantuml
@startuml
!define DFD_PROCESS usecase
!define DFD_ENTITY actor
!define DFD_STORE database

DFD_ENTITY "User" as user
DFD_ENTITY "Admin" as admin
DFD_ENTITY "Gemini AI API" as gemini

DFD_STORE "User DB" as user_db
DFD_STORE "Behavior Log DB" as log_db
DFD_STORE "Content DB" as content_db

DFD_PROCESS "1. Authentication\n& Authorization" as p1
DFD_PROCESS "2. Data Input\n& Analysis" as p2
DFD_PROCESS "3. Learning\n& Gamification" as p3
DFD_PROCESS "4. Admin\nManagement" as p4

user --> p1 : Credentials
p1 --> user_db : Verify/Store
p1 --> user : Auth Token

user --> p2 : Activity Data
p2 --> gemini : User Prompt
gemini --> p2 : AI Recommendations
p2 --> log_db : Save Logs
p2 --> user : AI Analysis Report

user --> p3 : Quiz Answers, Read Requests
p3 --> content_db : Fetch Articles/Quizzes
p3 --> log_db : Update EcoScore
p3 --> user : Results, Leaderboard

admin --> p4 : Admin Actions
p4 --> content_db : Manage Materials
p4 --> user_db : Manage Users
p4 --> admin : System Stats
@enduml
```

## 4. Architecture Diagram
Shows the high-level structure of the application.

```plantuml
@startuml
node "Client Node" {
  [Web Browser]
}

node "Frontend (Next.js)" {
  [UI Components (React)]
  [State Management (AuthContext)]
  [Routing (App Router)]
}

node "Backend (Node.js/Express)" {
  [API Routes]
  [Controllers]
  [Middleware (Auth/Admin)]
  [Mongoose Models]
}

database "MongoDB" {
  [Database Collections]
}

cloud "Google Services" {
  [Gemini AI API]
}

[Web Browser] --> [UI Components (React)] : HTTP/HTTPS
[UI Components (React)] --> [API Routes] : REST API (Axios)
[API Routes] --> [Middleware (Auth/Admin)]
[Middleware (Auth/Admin)] --> [Controllers]
[Controllers] --> [Mongoose Models] : CRUD Operations
[Mongoose Models] --> [Database Collections] : TCP/IP
[Controllers] --> [Gemini AI API] : HTTPS (Prompts)
@enduml
```

## 5. Class Diagram
Represents the structural design of the backend models and controllers.

```plantuml
@startuml
class User {
  +String username
  +String email
  +String password
  +String role
  +Number ecoScore
  +register()
  +login()
}

class BehaviorLog {
  +ObjectId userId
  +Object activityData
  +String aiAnalysis
  +Number carbonFootprint
  +saveLog()
  +getLogsByUser()
}

class Article {
  +String title
  +String content
  +createArticle()
  +getArticles()
}

class QuizQuestion {
  +String question
  +Array options
  +String correctAnswer
  +validateAnswer()
}

class AnalysisController {
  +analyzeActivity(req, res)
}

class AuthController {
  +loginUser(req, res)
  +registerUser(req, res)
}

AnalysisController --> BehaviorLog : creates >
AnalysisController --> User : updates score >
AuthController --> User : authenticates >
@enduml
```

## 6. Sequence Diagram
Demonstrates the workflow for a User Analysis Request.

```plantuml
@startuml
actor User
participant "Frontend (Next.js)" as Frontend
participant "Backend (Express)" as Backend
participant "MongoDB" as Database
participant "Gemini API" as Gemini

User -> Frontend : Submits Activity Form
Frontend -> Backend : POST /api/analyze (JWT + Data)
activate Backend
Backend -> Backend : Auth Middleware verifies JWT
Backend -> Gemini : Send Prompt with Activity Data
activate Gemini
Gemini --> Backend : Return Carbon Footprint & Recommendations
deactivate Gemini
Backend -> Database : Save BehaviorLog
activate Database
Database --> Backend : Confirm Save
deactivate Database
Backend --> Frontend : Return JSON Response (Analysis)
deactivate Backend
Frontend -> User : Display AI Report Charts/Cards
@enduml
```

## 7. Activity Diagram
Visualizes the flow of the AI Analysis process.

```plantuml
@startuml
start
:User logs in;
if (Authenticated?) then (yes)
  :Navigate to /analyze;
  :Input Activity Data (Transport, Energy, Diet);
  :Submit Form;
  :Frontend sends API Request;
  :Backend receives data;
  :Backend formats prompt;
  :Backend calls Gemini API;
  :Gemini API returns analysis;
  :Backend saves data to MongoDB;
  :Backend sends response to Frontend;
  :Frontend displays results to User;
else (no)
  :Redirect to Login Page;
endif
stop
@enduml
```

## 8. State Transition Diagram
Shows the states of a user session.

```plantuml
@startuml
[*] --> Guest

Guest --> Authenticating : login()
Authenticating --> LoggedIn : successful auth
Authenticating --> Guest : failed auth

LoggedIn --> Analyzing : navigates to /analyze
Analyzing --> ViewingResults : submits data & receives response
ViewingResults --> LoggedIn : closes results

LoggedIn --> Learning : navigates to /learning
Learning --> TakingQuiz : starts quiz
TakingQuiz --> Learning : finishes quiz

LoggedIn --> Guest : logout()
@enduml
```

## 9. Component Diagram
Shows the structural relationship between system components.

```plantuml
@startuml
package "Frontend (React/Next.js)" {
  [AuthContext] - [Pages]
  [Pages] - [Components]
  [Components] - [Axios Service]
}

package "Backend (Node/Express)" {
  [Express Router] - [Controllers]
  [Controllers] - [Mongoose Models]
  [Express Router] .> [Middleware] : uses
}

[Axios Service] --> [Express Router] : REST API
[Mongoose Models] --> [MongoDB] : TCP
[Controllers] --> [Gemini API] : HTTPS
@enduml
```

## 10. Deployment Diagram
Illustrates the physical deployment of the application.

```plantuml
@startuml
node "User Device" {
  node "Web Browser" {
    artifact "React Single Page App"
  }
}

node "Vercel / Netlify" {
  node "Next.js Server" {
    artifact "Frontend Assets"
  }
}

node "Cloud Provider (e.g., Render/Heroku)" {
  node "Node.js Server" {
    artifact "Express API"
  }
}

node "MongoDB Atlas" {
  database "Cluster" {
    artifact "Database Collections"
  }
}

cloud "Google Cloud" {
  node "Generative AI" {
    artifact "Gemini Models"
  }
}

"Web Browser" -- "Next.js Server" : HTTPS
"Web Browser" -- "Node.js Server" : HTTPS (API Calls)
"Node.js Server" -- "Cluster" : mongodb+srv://
"Node.js Server" -- "Generative AI" : HTTPS
@enduml
```

## 11. Collaboration (Communication) Diagram
Similar to sequence diagram but focuses on object relationships for the Login process.

```plantuml
@startuml
object "User UI : LoginPage" as ui
object "Auth Controller : AuthController" as authCtrl
object "User Model : User" as userModel
object "Database : MongoDB" as db

ui -> authCtrl : 1. POST /login (email, pass)
authCtrl -> userModel : 2. findOne({email})
userModel -> db : 3. query
db -> userModel : 4. return document
userModel -> authCtrl : 5. document instance
authCtrl -> authCtrl : 6. bcrypt.compare(pass, hash)
authCtrl -> authCtrl : 7. generate JWT
authCtrl -> ui : 8. 200 OK + Token
@enduml
```

## 12. Database Architecture Tiers
These diagrams illustrate the structural differences between 1-tier, 2-tier, and 3-tier application/database architectures. Our AI Environmental Impact Analyzer project utilizes a **3-tier architecture**.

### 1-Tier Architecture
Everything (UI, Logic, Data) is contained within a single machine/environment. Not typically used for web applications.

```plantuml
@startuml
node "Single Machine (1-Tier)" {
  component "Presentation Layer (UI)" as ui
  component "Business Logic Layer" as logic
  database "Database (Data Layer)" as db
  
  ui --> logic
  logic --> db
}
@enduml
```

### 2-Tier Architecture
Client-Server model where the client directly communicates with the database server. Logic can be on either side.

```plantuml
@startuml
node "Client Node (Tier 1)" {
  component "Presentation Layer (UI)" as ui
  component "Business Logic" as logic
}

node "Database Server Node (Tier 2)" {
  database "Database (Data Layer)" as db
}

logic <--> db : Network/DB Connection
@enduml
```

### 3-Tier Architecture
The standard web application model, separating UI, Logic, and Data into distinct tiers.

```plantuml
@startuml
node "Client Node (Presentation Tier)" {
  component "Web Browser / Frontend UI" as frontend
}

node "Application Server (Application Tier)" {
  component "Business Logic" as logic
  component "Backend API" as api
}

node "Database Server (Data Tier)" {
  database "Database (MongoDB)" as db
}

frontend <--> api : HTTP/REST
api --> logic
logic <--> db : TCP / DB Protocol
@enduml
```
