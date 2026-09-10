# 🤖 AI Interview & Resume Analyzer

A full-stack AI-powered web application that helps users analyze
resumes, identify skill gaps, generate interview reports, and create
ATS-optimized resumes.

The project is built with **React.js, Node.js, Express.js, MongoDB,
Google Gemini API, JWT authentication, and Puppeteer**.

------------------------------------------------------------------------

## ✨ Features

### 🔐 Secure Authentication

-   User registration and login
-   JWT-based authentication
-   Protected routes
-   Authentication middleware
-   JWT token blacklisting
-   Secure logout flow
-   Current-user (`getMe`) functionality

### 📄 Resume Parsing & Skill Extraction

-   Resume file upload
-   AI-powered resume parsing
-   Automatic skill extraction
-   Structured AI-generated analysis

### 🤖 AI-Powered Interview Analysis

-   Generate interview reports using Gemini AI
-   Analyze a candidate's resume and skills
-   Detect missing or weak skills
-   Identify skill gaps
-   Store generated reports in MongoDB
-   View individual and recent reports

### 🎯 ATS-Optimized Resume Generation

-   Generate resume content with AI
-   Optimize resume content for ATS systems
-   Convert generated resume data into an HTML template
-   Generate a professional PDF using Puppeteer

### 🖥️ Frontend

-   React.js with Vite
-   React Router
-   Context API for state management
-   Custom React hooks
-   Axios API services
-   Protected frontend routes
-   SCSS-based styling

------------------------------------------------------------------------

## 🛠️ Tech Stack

  Category           Technologies
  ------------------ ------------------------
  Frontend           React.js, Vite
  Routing            React Router
  State Management   React Context API
  HTTP Client        Axios
  Styling            SCSS
  Backend            Node.js, Express.js
  Database           MongoDB, MongoDB Atlas
  ODM                Mongoose
  Authentication     JWT
  File Upload        Multer
  Validation         Zod
  AI                 Google Gemini API
  PDF Generation     Puppeteer
  API Testing        Postman

------------------------------------------------------------------------

## 🏗️ Project Architecture

The application follows a modular full-stack architecture where the
frontend communicates with the Express backend through REST APIs.

``` text
                         ┌─────────────────────┐
                         │      React.js       │
                         │      Frontend       │
                         └──────────┬──────────┘
                                    │
                              Axios / REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Express.js     │
                         │       Routes        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Controllers     │
                         │   Business Logic    │
                         └──────┬────────┬─────┘
                                │        │
                       ┌────────▼───┐  ┌─▼────────────┐
                       │  Services  │  │  Middleware  │
                       │ Gemini API │  │ JWT / Multer │
                       └──────┬─────┘  └──────────────┘
                              │
                              ▼
                       ┌───────────────┐
                       │    MongoDB    │
                       │     Atlas     │
                       └───────────────┘

                              │
                              ▼
                       ┌───────────────┐
                       │   Puppeteer   │
                       │    HTML → PDF │
                       └───────────────┘
```

------------------------------------------------------------------------

## 📁 Folder Structure

``` text
Gen AI Full Stack Web Development Project/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── blacklist.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   └── temp.js
│   │   │
│   │   └── app.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   └── Protected.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.js
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Login.jsx
│   │   │   │   │   └── Register.jsx
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.api.js
│   │   │   │   ├── auth.context.jsx
│   │   │   │   └── auth.form.scss
│   │   │   │
│   │   │   └── interview/
│   │   │       ├── hooks/
│   │   │       │   └── useInterview.js
│   │   │       ├── pages/
│   │   │       │   ├── Home.jsx
│   │   │       │   └── Interview.jsx
│   │   │       ├── services/
│   │   │       │   └── interview.api.js
│   │   │       ├── style/
│   │   │       │   ├── home.scss
│   │   │       │   └── interview.scss
│   │   │       └── interview.context.jsx
│   │   │
│   │   ├── style/
│   │   │   ├── button.scss
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## 🔄 How the Application Works

### 1. Authentication Flow

``` text
User
 │
 ├── Register
 │      │
 │      ▼
 │   Auth Controller
 │      │
 │      ▼
 │   Create User
 │      │
 │      ▼
 │   Generate JWT
 │
 └── Login
        │
        ▼
   Verify Credentials
        │
        ▼
    Generate JWT
        │
        ▼
   Authentication Cookie
        │
        ▼
   Protected Request
        │
        ▼
   Auth Middleware
        │
        ├── Verify JWT
        │
        └── Check Blacklist
                │
                ▼
          Authorized User
```

### 2. Logout & Token Blacklisting

When a user logs out, the authentication token is added to a blacklist.

``` text
Logout Request
      │
      ▼
Extract JWT
      │
      ▼
Store Token in Blacklist
      │
      ▼
Clear Authentication Cookie
      │
      ▼
Future Requests
      │
      ▼
Auth Middleware
      │
      ▼
Blacklist Check
      │
      └── Token rejected
```

This prevents a previously issued token from continuing to authenticate
a user after logout.

------------------------------------------------------------------------

### 3. AI Interview Analysis Flow

``` text
                User
                  │
                  ▼
           Upload Resume
                  │
                  ▼
           React Frontend
                  │
                  ▼
          Interview API
                  │
                  ▼
          Express Controller
                  │
                  ▼
             AI Service
                  │
                  ▼
            Gemini API
                  │
                  ▼
       Structured AI Response
             /    |     \
            /     |      \
           ▼      ▼       ▼
       Resume   Skills   Skill Gaps
       Data     Found    Detected
            \     |      /
             \    |     /
                  ▼
          Interview Report
                  │
                  ▼
              MongoDB
                  │
                  ▼
           Frontend Report
```

------------------------------------------------------------------------

### 4. AI → PDF Resume Pipeline

The application uses AI to generate resume content and Puppeteer to
convert the result into a PDF.

``` text
Resume / User Information
          │
          ▼
      Gemini API
          │
          ▼
AI-Generated Resume Data
          │
          ▼
 ATS-Optimized Content
          │
          ▼
     HTML Template
          │
          ▼
       Puppeteer
          │
          ▼
      PDF Document
          │
          ▼
        Download
```

------------------------------------------------------------------------

## 🗄️ Database Models

### User

Stores user authentication and profile-related information.

``` text
User
 ├── Name
 ├── Email
 └── Password
```

### Interview Report

Stores AI-generated interview analysis and report information.

``` text
InterviewReport
 ├── User Reference
 ├── Resume / Interview Data
 ├── Extracted Skills
 ├── Skill Gaps
 └── AI Analysis
```

### Blacklist

Stores invalidated JWT tokens after logout.

``` text
Blacklist
 ├── Token
 └── Expiration Information
```

------------------------------------------------------------------------

## 🔑 Environment Variables

Create a `.env` file inside the `Backend` directory.

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

> **Important:** Use the exact environment variable names required by
> your implementation. Never commit your `.env` file or API keys to
> GitHub.

------------------------------------------------------------------------

## ⚙️ Installation

### Prerequisites

Make sure you have:

-   Node.js installed
-   npm installed
-   MongoDB Atlas account
-   Gemini API key
-   Git installed

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install Backend Dependencies

``` bash
cd Backend
npm install
```

Create the `.env` file and add your environment variables.

### 3. Start the Backend

``` bash
npm run dev
```

Or, if your project uses the start script:

``` bash
npm start
```

### 4. Install Frontend Dependencies

Open another terminal:

``` bash
cd Frontend
npm install
```

### 5. Start the Frontend

``` bash
npm run dev
```

The Vite development server will normally run at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 🧪 API Testing

Backend APIs can be tested using **Postman**.

The project contains API modules for:

### Authentication

-   Register
-   Login
-   Logout
-   Get current authenticated user

### Interview & AI

-   Generate interview report
-   Upload resume
-   Retrieve report by ID
-   Retrieve reports
-   Generate resume PDF

> Check `Backend/src/routes/` and the corresponding controllers for the
> exact routes and request formats used by the application.

------------------------------------------------------------------------

## 🔒 Security

The project implements several security mechanisms:

-   JWT authentication
-   Protected backend routes
-   Authentication middleware
-   JWT token blacklisting
-   HTTP-only authentication cookies
-   Environment variables for secrets
-   File upload middleware
-   Request validation using Zod

------------------------------------------------------------------------

## 🧠 What I Learned

Through this project, I worked with:

-   Full-stack application architecture
-   REST API development
-   JWT authentication
-   Token blacklisting
-   MongoDB and Mongoose
-   React Context API
-   Custom React hooks
-   Protected routes
-   File uploads with Multer
-   AI API integration
-   Structured AI responses
-   Resume parsing
-   Skill extraction
-   Skill-gap analysis
-   ATS-focused resume generation
-   Puppeteer PDF generation
-   Frontend/backend integration
-   Real-world project folder organization

------------------------------------------------------------------------

## 🚧 Future Improvements

Possible improvements include:

-   Add refresh-token rotation
-   Add rate limiting for AI endpoints
-   Add more detailed interview scoring
-   Support additional resume formats
-   Add interview history and analytics
-   Add role-specific interview questions
-   Improve ATS scoring
-   Add resume templates
-   Add automated test coverage
-   Add Docker support
-   Deploy frontend and backend to production
-   Add CI/CD using GitHub Actions

------------------------------------------------------------------------

## 📌 Project Highlights

> **Full-Stack Web Application**\
> React.js + Node.js + Express.js + MongoDB

> **Secure Authentication**\
> JWT + Protected Routes + Token Blacklisting

> **AI Integration**\
> Google Gemini API for resume and interview analysis

> **Resume Intelligence**\
> Resume Parsing + Skill Extraction + Skill Gap Detection

> **Resume Generation**\
> ATS-Optimized Resume + Puppeteer PDF Generation

------------------------------------------------------------------------

## 👨‍💻 Author

**Your Name**

GitHub: `https://github.com/YOUR_USERNAME`

LinkedIn: `https://www.linkedin.com/in/YOUR_USERNAME/`

------------------------------------------------------------------------

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on
GitHub.
