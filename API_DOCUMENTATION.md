# 🛠 API Documentation

The EDUSPARK API is a RESTful interface for managing all institute resources.

**Base URL**: `http://localhost:5002/api`

---

## 🔐 Authentication

### Admin Login
- **Endpoint**: `POST /admin/login`
- **Body**: `{ email, password }`
- **Response**: Sets `token` cookie.

### Student Login
- **Endpoint**: `POST /student-auth/login`
- **Body**: `{ username, password }`
- **Response**: Sets `token` cookie.

---

## 👨‍🏫 Faculty Management
- **GET `/faculty`**: Public. Returns all faculty members.
- **POST `/faculty`**: Admin Only. Add a new faculty member.
- **DELETE `/faculty/:id`**: Admin Only. Remove a faculty member.

---

## 🖼 Gallery
- **GET `/gallery`**: Public. Returns all gallery images.
- **POST `/gallery`**: Admin Only. Upload a new image.
- **DELETE `/gallery/:id`**: Admin Only. Remove an image.

---

## 📢 Notices
- **GET `/notices`**: Public. Returns all announcements.
- **POST `/notices`**: Admin Only. Create a new notice.
- **DELETE `/notices/:id`**: Admin Only. Remove a notice.

---

## 📚 Quizzes
- **GET `/quizzes`**: Student/Admin. Returns quizzes. Students only see `published: true`.
- **POST `/quizzes`**: Admin Only. Create a quiz.
- **GET `/quizzes/:id`**: Returns specific quiz details.
- **PATCH `/quizzes/:id`**: Admin Only. Update/Publish quiz.
- **DELETE `/quizzes/:id`**: Admin Only. Delete quiz.

---

## 📝 Results & Analytics
- **POST `/results`**: Student Only. Submit quiz answers.
- **GET `/results/student`**: Student Only. Returns logged-in student's results.
- **GET `/analytics/overview`**: Admin Only. Returns institute-wide stats.
- **GET `/analytics/leaderboard`**: Returns top-performing students.

---

## 👥 Student Management (Admin)
- **GET `/students`**: Admin Only. List all students.
- **POST `/students`**: Admin Only. Register a new student.
- **PATCH `/students/:id`**: Admin Only. Update student status/info.
- **DELETE `/students/:id`**: Admin Only. Remove a student.

---

## 📁 Study Material (Notes)
- **GET `/notes`**: Student/Admin. List all study notes.
- **POST `/notes`**: Admin Only. Upload a new note.
- **DELETE `/notes/:id`**: Admin Only. Remove a note.
