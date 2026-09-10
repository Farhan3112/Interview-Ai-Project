# 🤖 AI Interview & Resume Analyzer

> A full-stack AI-powered career platform built with React.js, Node.js, Express.js, MongoDB, Google Gemini API, and Puppeteer.

This project is designed to simulate a real-world AI-powered career platform where users can upload their resumes, analyze job descriptions, identify skill gaps, generate personalized AI-powered interview questions, and create ATS-optimized resumes.

It combines **Full Stack Development with Generative AI** to demonstrate how modern AI features can be integrated into a production-style web application.

---

## ✨ Features

### 🔐 Secure Authentication
- User registration and login
- JWT-based authentication
- Protected frontend and backend routes
- Authentication middleware
- JWT token blacklisting
- Secure logout flow
- Current authenticated user (`getMe`) functionality

### 📄 Resume Analysis
- Resume file upload
- AI-powered resume parsing
- Automatic skill extraction
- Structured AI-generated analysis
- Resume information used for personalized career analysis

### 💼 Job Description Analysis
- Analyze job descriptions against a user's resume
- Identify relevant skills and requirements
- Compare existing skills with job requirements
- Detect missing or weak skills

### 🧠 AI-Powered Skill Gap Detection
- Identify skills missing from the user's profile
- Highlight areas that need improvement
- Generate actionable insights based on resume/job requirements

### 🤖 AI-Powered Interview Preparation
- Generate personalized interview questions
- Use resume and skill information to make questions relevant
- Generate AI-powered interview analysis and reports
- Store generated reports for later access

### 🎯 ATS-Optimized Resume Generation
- Generate resume content using Gemini AI
- Optimize resume content for ATS systems
- Convert generated resume data into an HTML resume
- Generate a professional PDF using Puppeteer

### 🖥️ Modern Frontend Architecture
- React.js with Vite
- React Router
- Context API for state management
- Custom React hooks
- Axios-based API services
- Feature-based folder structure
- Protected routes
- SCSS styling

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Routing | React Router |
| State Management | React Context API |
| HTTP Client | Axios |
| Styling | SCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| File Upload | Multer |
| Validation | Zod |
| AI | Google Gemini API |
| PDF Generation | Puppeteer |
| API Testing | Postman |

---

## 🏗️ Project Architecture

The application follows a modular full-stack architecture where the React frontend communicates with the Express backend through REST APIs.

```text
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

---

## 📁 Project Structure

```text
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

---

## 🔄 How the Application Works

### 1. Authentication Flow

```text
Register / Login
       │
       ▼
Express Auth Route
       │
       ▼
Auth Controller
       │
       ├── Validate credentials
       ├── Create / verify user
       └── Generate JWT
       │
       ▼
Authentication Cookie
       │
       ▼
Protected API Request
       │
       ▼
Auth Middleware
       │
       ├── Verify JWT
       └── Check Token Blacklist
       │
       ▼
Authorized Request
```

### 2. Logout & Token Blacklisting

```text
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

Token blacklisting ensures that a previously issued JWT cannot continue to authenticate the user after logout.

### 3. Resume & Job Analysis Flow

```text
User
 │
 ├── Upload Resume
 │
 └── Provide Job Description
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
          ├── Resume Parsing
          ├── Skill Extraction
          ├── Job Analysis
          └── Skill Gap Detection
                    │
                    ▼
              AI Analysis
                    │
                    ▼
                 MongoDB
                    │
                    ▼
             Frontend Report
```

### 4. AI Interview Question Generation

```text
Resume + Job Description
          │
          ▼
      Gemini AI
          │
          ▼
 Personalized Analysis
          │
          ▼
Interview Questions
          │
          ▼
     User Practice
```

### 5. AI → PDF Resume Pipeline

```text
User / Resume Data
        │
        ▼
    Gemini API
        │
        ▼
AI-Generated Resume
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
       User
```

---

## 🗄️ Database Models

### User

Stores user authentication and profile-related information.

```text
User
 ├── Name
 ├── Email
 └── Password
```

### Interview Report

Stores AI-generated interview analysis and report information.

```text
InterviewReport
 ├── User Reference
 ├── Resume / Interview Data
 ├── Extracted Skills
 ├── Skill Gaps
 └── AI Analysis
```

### Blacklist

Stores invalidated JWT tokens after logout.

```text
Blacklist
 ├── Token
 └── Expiration Information
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `Backend` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

> **Important:** Use the exact environment variable names required by your implementation. Never commit `.env` files, database credentials, JWT secrets, or API keys to GitHub.

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- MongoDB Atlas account
- Gemini API key
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

Create the `.env` file and configure your environment variables.

### 3. Start the Backend

```bash
npm run dev
```

Or:

```bash
npm start
```

### 4. Install Frontend Dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

### 5. Start the Frontend

```bash
npm run dev
```

The Vite development server will normally run at:

```text
http://localhost:5173
```

---

## 🧪 API Testing

The backend APIs can be tested using **Postman**.

### Authentication APIs

- Register
- Login
- Logout
- Get current authenticated user

### Interview & AI APIs

- Upload resume
- Generate AI interview analysis
- Generate interview questions
- Analyze resume/job requirements
- Detect skill gaps
- Retrieve report by ID
- Retrieve reports
- Generate ATS-optimized resume PDF

> Check `Backend/src/routes/` and the corresponding controllers for the exact API endpoints and request formats used by the application.

---

## 🔒 Security

The application implements several security mechanisms:

- JWT authentication
- Protected backend routes
- Authentication middleware
- JWT token blacklisting
- HTTP-only authentication cookies
- Environment variables for secrets
- File upload middleware
- Request validation with Zod

---

## 🧠 Key Concepts Demonstrated

This project demonstrates practical experience with:

- Full-stack application architecture
- REST API development
- React component architecture
- Feature-based frontend organization
- React Context API
- Custom React hooks
- JWT authentication
- JWT token blacklisting
- Protected routes
- MongoDB and Mongoose
- File uploads with Multer
- Request validation with Zod
- Google Gemini API integration
- Resume parsing
- Skill extraction
- Job description analysis
- AI-powered skill-gap detection
- AI-generated interview questions
- ATS-optimized resume generation
- Puppeteer PDF generation
- Frontend/backend integration
- Real-world project structuring

---

## 🚧 Future Improvements

- Refresh-token rotation
- Rate limiting for AI endpoints
- More detailed interview scoring
- Support for additional resume formats
- Interview history and analytics
- Role-specific interview question generation
- Improved ATS scoring
- Multiple resume templates
- Automated unit and integration tests
- Docker support
- Production deployment
- CI/CD with GitHub Actions

---

## 📌 Project Highlights

### Full-Stack Application
**React.js + Node.js + Express.js + MongoDB**

### Secure Authentication
**JWT + Protected Routes + Token Blacklisting**

### Generative AI
**Google Gemini API for resume, job, skill, and interview analysis**

### Career Intelligence
**Resume Parsing + Skill Extraction + Job Description Analysis + Skill Gap Detection**

### Interview Preparation
**AI-Generated Personalized Interview Questions + Interview Reports**

### Resume Generation
**ATS-Optimized Resume + Puppeteer PDF Generation**

---

## 🎥 Project Walkthrough

This project was developed as a complete full-stack + Gen AI application walkthrough covering:

- Backend and authentication setup
- MongoDB Atlas integration
- JWT authentication and token blacklisting
- React frontend architecture
- Protected routes and authentication state
- Gemini AI integration
- Resume parsing and AI analysis
- Interview report generation
- Resume PDF generation with Puppeteer
- Frontend integration and report management

---

## 👨‍💻 Author

**Farhan Shamshad**

GitHub: `https://github.com/Farhan3112`

LinkedIn: `https://www.linkedin.com/in/farhan3112/`

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.
