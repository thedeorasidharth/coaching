# EDUSPARK - Premium Coaching Management System

EDUSPARK is a high-performance, dynamic, and aesthetically premium management platform for educational institutes. It provides a seamless experience for administrators to manage content and for students to engage in interactive learning.

---

## 🏗 Project Architecture

EDUSPARK follows a **decoupled Client-Server architecture** using the MERN stack with modern enhancements.

### High-Level Flow
1. **Admin Panel**: Central hub for content management (CMS). Admins manage faculty, gallery, notices, and quizzes.
2. **MongoDB Database**: Persistent storage for all dynamic content, user records, and assessment results.
3. **Public Website**: A premium, SEO-optimized landing page that dynamically displays the latest faculty, gallery, and notices.
4. **Student Dashboard**: A personalized portal for students to take quizzes, view results, and access study materials.

---

## 📂 Project Structure

### 💻 Frontend (`/src`)
Built with **Next.js 15 (App Router)** and **Tailwind CSS**.

- **`/app`**: Contains all routes and page layouts.
  - `/(auth)`: Grouped authentication routes (Login, Admin Login).
  - `/(dashboard)`: Protected dashboard routes for both Students and Admins.
- **`/components`**: Reusable UI components and section-wise blocks.
  - `/sections`: Large homepage components (Hero, Faculty, Gallery, etc.).
  - `/dashboard`: Specific components for the internal portal (Sidebar, Layout).
  - `/ui`: Atomic design components (Button, Card, Input).
  - `/animations`: Global animation wrappers (Framer Motion).
- **`/store`**: State management using **Zustand** (Auth state, User info).
- **`/lib`**: Utility configurations (Axios instance with credentials).
- **`/types`**: Global TypeScript interfaces.

### ⚙️ Backend (`/server`)
Built with **Node.js**, **Express**, and **Mongoose**.

- **`/controllers`**: Core business logic for each resource.
- **`/routes`**: API endpoint definitions.
- **`/models`**: MongoDB schemas with validation and middleware (bcrypt hooks).
- **`/middleware`**: Security layers (JWT verification, Role-based access control).
- **`/config`**: Database and environment configurations.

---

## 🔐 Authentication System

EDUSPARK implements a secure, **Cookie-based JWT Authentication** flow.

### Flow Overview
1. **Login**: User submits credentials to `/api/admin/login` or `/api/students/login`.
2. **Token Generation**: Backend verifies credentials, generates a JWT, and sends it as an **HTTP-only Cookie** named `token`.
3. **Middleware Protection**:
   - **Frontend**: Next.js `middleware.ts` checks for the presence of the `token` cookie before allowing access to `/(dashboard)` routes.
   - **Backend**: `protect` middleware verifies the JWT from cookies. `adminOnly` and `studentOnly` check the `role` claim in the decoded token.
4. **Logout**: Cookie is cleared from the browser.

---

## 📊 Database Models (MongoDB)

| Model | Description | Key Fields |
|-------|-------------|------------|
| **Admin** | Superuser accounts | `name`, `email`, `password`, `role` |
| **Student** | Student accounts | `fullName`, `username`, `class`, `status`, `role` |
| **Faculty** | Institute teachers | `name`, `subject`, `qualifications`, `imageUrl` |
| **Gallery** | Campus highlights | `imageUrl`, `caption` |
| **Notice** | Announcements | `title`, `content`, `isImportant` |
| **Quiz** | Assessments | `title`, `subject`, `questions[]`, `published` |
| **Result** | Student performance | `studentId`, `quizId`, `score`, `percentage` |
| **Note** | Study material | `title`, `category`, `fileUrl` |

---

## 🔄 Dynamic CMS Integration

The platform is designed to be fully manageable without touching code.

1. **Admin Post**: Admin uploads a new Faculty member or Gallery image via the Dashboard.
2. **Backend Update**: Data is saved to MongoDB.
3. **Frontend Fetch**: 
   - The Public Website fetches data using `axios` from `/api/faculty`, `/api/gallery`, and `/api/notices`.
   - The Student Dashboard fetches `/api/quizzes` and `/api/notes`.
4. **Real-time Reflection**: Changes made in the Admin Panel reflect instantly on the public site and student portals.

---

## 🎓 Quiz & Analytics Flow

1. **Creation**: Admin builds a quiz with multiple-choice questions.
2. **Publishing**: Admin toggles `isPublished`. Only published quizzes appear in the Student Portal.
3. **Attempt**: Student takes the test. Timer and progress are tracked.
4. **Evaluation**: Submissions are evaluated **Server-Side** to prevent cheating.
5. **Analytics**: 
   - Admin sees average scores and toppers.
   - Students see their performance trend and global rank.
   - Homepage displays a **Daily Quiz** teaser pulled randomly from active tests.

---

## 🚦 Current Project Status

### ✅ Completed
- [x] Full Premium UI/UX for Homepage & Dashboards.
- [x] Dynamic Faculty, Gallery, and Notice modules.
- [x] Admin & Student Authentication System.
- [x] Student Management (Add/Edit/Status).
- [x] Quiz Creation and Evaluation logic.
- [x] Leaderboard and Performance Analytics.
- [x] Responsive Design (Mobile & Desktop).

### 🟡 Partial
- [ ] Profile Image Upload (Currently uses Base64 or direct URLs).
- [ ] Detailed PDF Viewer for Study Notes (Currently opens in new tab).

### 🔴 Pending
- [ ] Automated Email/SMS notifications for Notices.
- [ ] Live Chat support for students.
- [ ] Payment gateway integration for courses.

---

## 🚀 Setup & Deployment

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Environment Variables (`.env`)
**Backend:**
```env
PORT=5002
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Installation
1. **Backend**:
   ```bash
   cd server
   npm install
   npm run seed  # Crucial: Creates the initial admin account
   npm run dev
   ```
2. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```

---

## 🛠 Developer Guidelines
- **Styling**: Always use the defined design tokens in `globals.css` and Tailwind.
- **Logic**: Keep controllers thin; move complex logic to services if the project grows.
- **Types**: Always update `src/types/index.ts` when modifying API responses.
- **Safety**: Never expose `JWT_SECRET` or DB credentials in the frontend.

---

## 🗺 Future Roadmap
1. **Cloudinary Integration**: For optimized image and PDF storage.
2. **Socket.io**: Real-time notifications for new notices and test results.
3. **PWA Support**: Allow students to install the portal as a mobile app.
4. **AI-Powered Insights**: Suggestions for students based on their weak topics in quizzes.

---
*Created with ❤️ for EDUSPARK Educational Institutes.*
