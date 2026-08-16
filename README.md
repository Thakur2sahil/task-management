# Task Management System

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_ORM-336791?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-Not%20Specified-lightgrey)

## Overview

Task Management System is a full-stack web application for creating, assigning, and tracking tasks within a team. It has two user roles — **Admin** and **User** — with separate dashboards. Admins can create tasks, assign them to users, and monitor all tasks across the system, while regular users can view the tasks assigned to them and update their status. The project is split into a `frontend` (React + Vite) and a `backend` (Express + Prisma + PostgreSQL) that communicate over a REST API.

## Features

**User-facing (Frontend)**
- User registration and login with client-side form validation (Yup)
- Role-based routing — Admin and User see different dashboards and navigation
- Admin dashboard with task summary cards (Total, Pending, In Progress, Completed) and filterable task table (by status, priority, assigned user)
- Admin task creation form with user assignment, priority, status, and deadline
- Admin task view, update, and delete pages
- User dashboard with personal task summary and filterable task table
- User task list page where a user can update the status of their own tasks inline
- Global modal system for success/error feedback with post-action navigation
- "Unauthorized" page for users attempting to access a role they don't have
- Persisted session via JWT and role stored in `localStorage`

**API-facing (Backend)**
- User registration and login with hashed passwords (bcrypt) and JWT issuance
- JWT-based route protection for all endpoints except register/login
- Full CRUD for tasks (create, read, update, delete)
- Task listing scoped to the logged-in user (`/api/task/user`)
- Task status update restricted to the task's assignee
- Admin dashboard endpoint with task summary counts and optional filtering by status, priority, and assigned user
- User dashboard endpoint with the logged-in user's own task summary and filtering
- User listing endpoint (excludes the currently logged-in user), used to populate the "assign to" dropdown
- Centralized error handling middleware, including specific handling for Prisma errors (duplicate records, missing tables)

> **Note:** The backend also contains a `comments.js` controller with `addComment`, `getComments`, and `deleteComment` functions, and the `Task`/`User` Prisma models include a `Comment` relation. However, no route file wires this controller to the Express app (`mainRoute.js` only registers `auth`, `task`, `user`, and `admin` routes), so there is currently **no active comment API endpoint**.

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend framework | React 19 (Vite) | Building the single-page application UI |
| Routing | React Router DOM v7 | Client-side routing and role-based route protection |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first styling |
| Form validation (frontend) | Yup | Schema-based validation for login, signup, and task forms |
| Backend framework | Express 5 | REST API server and routing |
| Database | PostgreSQL | Relational data storage |
| ORM | Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`) | Database schema, migrations, and queries |
| Authentication | JSON Web Tokens (`jsonwebtoken`) | Stateless session/authentication tokens |
| Password hashing | bcrypt | Hashing and verifying user passwords |
| Validation (backend) | Zod | Listed as a backend dependency (see note below) |
| Cross-origin requests | cors | Enabling frontend-backend communication across origins |
| Environment config | dotenv | Loading environment variables from `.env` |
| Dev tooling | nodemon | Auto-restarting the backend server in development |
| Build tool | Vite | Frontend dev server and production bundling |

> **Note:** `axios` and `lucide-react` are listed as frontend dependencies in `package.json` but are not currently imported/used anywhere in the frontend source — all HTTP calls use the native `fetch` API. Similarly, `zod` is a backend dependency, but request validation in the current controllers is done with plain `if` checks rather than Zod schemas.

## Project Architecture

```
Frontend (React + Vite)
        │
        │  REST API calls (fetch, JWT in Authorization header)
        ▼
Backend (Express, mounted at /api)
        │
        │  Prisma Client
        ▼
PostgreSQL Database
```

The frontend calls the backend using the base URL defined in `VITE_PUBLIC_API_URL`. All protected requests attach the JWT (obtained at login) as a raw value in the `Authorization` header. The backend's `authMiddleware` verifies this token before allowing access to `/api/task`, `/api/user`, and `/api/admin` routes. The backend talks to PostgreSQL exclusively through Prisma Client.

## Project Structure

```text
task-management/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database models (User, Task, Comment) and enums
│   │   └── migrations/            # Prisma migration history
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Prisma Client + PostgreSQL adapter setup
│   │   ├── controller/
│   │   │   ├── authController.js  # register, login
│   │   │   ├── taskController.js  # task CRUD + status update
│   │   │   ├── usersController.js # user listing + user dashboard
│   │   │   ├── adminController.js # admin dashboard
│   │   │   └── comments.js        # comment logic (not currently routed)
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  # JWT verification
│   │   │   └── errorHandler.js    # centralized error responses
│   │   ├── routes/
│   │   │   ├── mainRoute.js       # mounts auth/task/user/admin routes
│   │   │   ├── authRoute.js
│   │   │   ├── taskRoute.js
│   │   │   ├── userRoute.js
│   │   │   └── adminRoute.js
│   │   ├── app.js                 # Express app setup (middleware, routes, error handler)
│   │   └── server.js              # Entry point, starts the HTTP server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx     # role-based route guard
│   │   │   ├── TaskTable.jsx          # reusable paginated table
│   │   │   ├── layout/
│   │   │   │   ├── adminLayout.jsx
│   │   │   │   └── userLayout.jsx
│   │   │   └── modal/
│   │   │       └── ModalContext.jsx   # global success/error modal
│   │   ├── pages/
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── adminDashboard.jsx
│   │   │   ├── userDashboard.jsx
│   │   │   ├── AddTask.jsx
│   │   │   ├── task.jsx               # view/update/delete task (formtype prop)
│   │   │   ├── userTask.jsx
│   │   │   └── unauthorized.jsx
│   │   ├── utils/
│   │   │   └── FetchApi.js            # fetch wrapper that attaches the JWT
│   │   ├── validations/
│   │   │   ├── authvalidations.js
│   │   │   └── taskvalidations.js
│   │   ├── App.jsx                    # route definitions
│   │   └── main.jsx                   # app entry point
│   └── package.json
└── README.md
```

## Frontend

- **Main pages:** Login, Signup, Admin Dashboard, User Dashboard, Add Task, Task (view/update/delete), User Task list, Unauthorized.
- **Components:** `TaskTable` (a reusable, paginated table with optional View/Update/Delete actions), `AdminLayout`/`UserLayout` (sidebar navigation shells with a logout button), `ModalContext` (a React Context-based global modal for success/error messages with optional post-close navigation).
- **Routing:** Handled by `react-router-dom` in `App.jsx`. `/` and `/signup` are public. `/user/*` and `/admin/*` are nested routes wrapped in `ProtectedRoute`, which restricts access by role (`USER` or `ADMIN`).
- **Authentication handling:** On successful login, the JWT and role are saved to `localStorage`. `ProtectedRoute` reads these values to decide whether to render the requested page, redirect to `/login`, or redirect to `/unauthorized`. Logging out clears both values and redirects to `/`.
- **Form validation:** Login, signup, and task-creation forms are validated client-side with **Yup** schemas (`authvalidations.js`, `taskvalidations.js`) before any API call is made. Validation errors are shown inline per field.
- **API communication:** Auth requests (`login`, `signup`) use the native `fetch` API directly. All other requests (tasks, dashboards, users) go through the `FetchAPI` helper in `utils/FetchApi.js`, which automatically attaches the stored JWT to the `Authorization` header and parses JSON responses.
- **State management:** Local component state via `useState`/`useEffect` (no external state library). Global modal state is provided via React Context (`ModalContext`).
- **Notable UI functionality:** Filterable, paginated task tables; inline task-status updates on the user task list; a task-creation form that fetches the user list to populate the "assign to" dropdown.

## Backend

- **Server setup:** `server.js` loads environment variables and starts the Express app (from `app.js`) on `process.env.PORT` (defaults to `5000`), bound to `0.0.0.0`.
- **App setup:** `app.js` applies `cors()` and `express.json()`, mounts all API routes under `/api`, and registers a 404 handler followed by a centralized error handler.
- **API routes:** See [API Documentation](#api-documentation) below. Routes are grouped under `/api/auth`, `/api/task`, `/api/user`, and `/api/admin`, all combined in `mainRoute.js`.
- **Controllers:** `authController` (register/login), `taskController` (task CRUD + status update), `usersController` (user listing + user dashboard), `adminController` (admin dashboard). `comments.js` exists but is unused (see note above).
- **Models:** Defined in `prisma/schema.prisma` — `User`, `Task`, `Comment`, plus `Role`, `TaskStatus`, and `TaskPriority` enums.
- **Middleware:** `authMiddleware.js` verifies the JWT from the `Authorization` header and attaches the decoded payload to `req.user`. `errorHandler.js` catches all errors passed via `next(error)`, with special handling for Prisma error codes `P2021` (missing table) and `P2002` (unique constraint violation).
- **Authentication/authorization:** JWT verification is applied to every route except `/api/auth/login` and `/api/auth/register` (mounted via `mainRoute.use(authMiddleware)` after the auth routes). The decoded token's `role` is included in the JWT payload, but individual controllers (e.g. `adminController`, `taskController`) do not check `req.user.role` before executing — see the [Authentication & Authorization](#authentication--authorization) section for details.
- **Database interaction:** All database access goes through Prisma Client (`config/db.js`), configured with the `@prisma/adapter-pg` PostgreSQL adapter and a `task_manager` schema.
- **Error handling:** Controllers wrap logic in `try/catch` and forward errors to `next(error)`, which is handled centrally by `errorHandler.js`.

## Authentication & Authorization

- **Registration (`POST /api/auth/register`):** Requires `user_name`, `email`, `password`, `confirmPassword`. Rejects if any field is missing, if passwords don't match, or if the email already exists. Passwords are hashed with `bcrypt` (10 salt rounds) before being stored. New users are created with the default role `USER` (there is no way to register as `ADMIN` through this endpoint).
- **Login (`POST /api/auth/login`):** Requires `email` and `password`. On success, returns a JWT (signed with `JWT_SECRET`, 1-day expiry) containing `user_id`, `email`, `user_name`, and `role`, along with the `role` value.
- **Token usage:** The frontend stores the token and role in `localStorage` and sends the token as the raw value of the `Authorization` header (no `Bearer` prefix) on every subsequent request. `authMiddleware` reads this header and verifies the token with `JWT_SECRET`.
- **Role-based access, as implemented in the code:**
  - The `Role` enum has two values: `ADMIN` and `USER`.
  - On the **frontend**, `ProtectedRoute` restricts `/admin/*` pages to `ADMIN` and `/user/*` pages to `USER`, based on the role stored in `localStorage`. Users without the required role are redirected to `/unauthorized`.
  - On the **backend**, `authMiddleware` only verifies that a valid JWT is present — it does not check `req.user.role`. This means role-based access control (e.g. restricting task creation, deletion, or the admin dashboard endpoint to `ADMIN` users) is currently enforced only at the frontend routing level, not inside the API controllers. Any authenticated user with a valid token can call any protected endpoint, including `/api/admin/dashboard` and the task create/update/delete endpoints.

## API Documentation

All endpoints are prefixed with `/api`. "Authentication" indicates whether a valid JWT is required in the `Authorization` header (see above).

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in and receive a JWT | No |
| GET | `/task` | Get all tasks (with assignee info) | Yes |
| GET | `/task/user` | Get tasks assigned to the logged-in user | Yes |
| GET | `/task/:id` | Get a single task by ID (with assignee and comments) | Yes |
| PATCH | `/task/:id/status` | Update the status of a task assigned to the logged-in user | Yes |
| POST | `/task/add` | Create a new task | Yes |
| PUT | `/task/update/:id` | Update an existing task | Yes |
| DELETE | `/task/delete/:id` | Delete a task | Yes |
| GET | `/user` | Get all users except the logged-in user | Yes |
| GET | `/user/dashboard` | Get the logged-in user's task summary and task list (supports `status`, `priority` query filters) | Yes |
| GET | `/admin/dashboard` | Get overall task summary and task list (supports `status`, `priority`, `assignedTo` query filters) | Yes |

### Example: Register

```json
POST /api/auth/register
{
  "user_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Passw0rd!",
  "confirmPassword": "Passw0rd!"
}
```
```json
201 Created
{
  "message": "User registered successfully",
  "user": { "id": 1, "email": "jane@example.com", "user_name": "Jane Doe" }
}
```

### Example: Login

```json
POST /api/auth/login
{
  "email": "jane@example.com",
  "password": "Passw0rd!"
}
```
```json
200 OK
{
  "message": "Login successful",
  "data": { "token": "<jwt>", "role": "USER" }
}
```

### Example: Create Task

```json
POST /api/task/add
Authorization: <jwt>
{
  "title": "Prepare report",
  "description": "Q3 summary",
  "priority": "HIGH",
  "status": "PENDING",
  "assignedTo": 2,
  "deadline": "2026-09-01"
}
```
```json
201 Created
{
  "success": true,
  "message": "Task created successfully",
  "task": { "id": 5, "title": "Prepare report", "status": "PENDING", "priority": "HIGH", "assignedTo": 2, "dueDate": "2026-09-01T00:00:00.000Z" }
}
```

### Example: Update Task Status

```json
PATCH /api/task/5/status
Authorization: <jwt>
{ "status": "IN_PROGRESS" }
```
```json
200 OK
{
  "success": true,
  "message": "Task status updated successfully",
  "task": { "id": 5, "status": "IN_PROGRESS", "...": "..." }
}
```

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_PUBLIC_API_URL=
```
- `VITE_PUBLIC_API_URL` — Base URL of the backend API (e.g. `http://localhost:5000`), used as a prefix for every frontend API call.

### Backend (`.env`, not committed — referenced via `process.env`)

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```
- `DATABASE_URL` — PostgreSQL connection string used by Prisma to connect to the database. Required; the app throws an error at startup if it's missing.
- `JWT_SECRET` — Secret key used to sign and verify JWTs. Required for login and for verifying protected requests.
- `PORT` — Port the Express server listens on. Optional; defaults to `5000`.

No real secret values are included above or anywhere in this repository's tracked files.

## Installation

```bash
git clone https://github.com/Thakur2sahil/task-management.git
cd task-management
```

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Configuration

1. **Database:** Provision a PostgreSQL database and note its connection string.
2. **Backend environment file:** Create a `.env` file inside `backend/` with `DATABASE_URL`, `JWT_SECRET`, and optionally `PORT` (see [Environment Variables](#environment-variables)).
3. **Frontend environment file:** Create/update a `.env` file inside `frontend/` with `VITE_PUBLIC_API_URL` pointing to the backend's URL (e.g. `http://localhost:5000`).
4. **Database schema:** Apply the Prisma schema to your database (see [Running the Project](#running-the-project) for the exact command).
5. **User roles:** All users registering through `/api/auth/register` receive the `USER` role by default. To test admin functionality, promote a user to `ADMIN` directly in the database (e.g. via Prisma Studio or a SQL update), since no endpoint currently sets a user's role to `ADMIN`.

## Running the Project

**Apply the database schema (from `backend/`):**
```bash
npx prisma migrate deploy
# or, for local development:
npx prisma migrate dev
```

**Start the backend (from `backend/`):**
```bash
npm run dev    # development, with nodemon
# or
npm start      # production
```

**Start the frontend (from `frontend/`):**
```bash
npm run dev
```

By default, Vite serves the frontend on port `5173` (configured in `vite.config.js`), and the backend listens on the port set by `PORT` (default `5000`).

## Available Scripts

**Backend (`backend/package.json`):**
| Script | Description |
|---|---|
| `npm start` | Runs the server with `node src/server.js` |
| `npm run dev` | Runs the server with `nodemon` for auto-reload during development |
| `npm test` | Placeholder script; no tests are currently configured |

**Frontend (`frontend/package.json`):**
| Script | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the frontend for production |
| `npm run lint` | Runs ESLint over the project |
| `npm run preview` | Serves the production build locally for preview |

## Usage

1. Register an account at `/signup`, then log in at `/`.
2. New accounts are created with the `USER` role and land on the User Dashboard, where they can see tasks assigned to them and update task status from the task list.
3. An account manually promoted to `ADMIN` in the database lands on the Admin Dashboard, where it can view all tasks, filter them by status/priority/assigned user, create new tasks (`/admin/add-task`) and assign them to any user, and view, update, or delete individual tasks.

## Validation and Error Handling

- **Frontend:** Login, signup, and task-creation forms use **Yup** schemas to validate required fields, email format, password strength (uppercase, lowercase, number, special character, minimum 6 characters), password confirmation match, and future-dated deadlines, before any request is sent. Validation errors are displayed per field.
- **Backend:** Controllers perform manual checks (e.g. required fields on register/login/add task, matching passwords, valid task ID, valid status values) and respond with appropriate HTTP status codes (`400`, `401`, `404`, `409`) and JSON error messages.
- **Centralized error handling:** Any error passed to `next(error)` is caught by `errorHandler.js`, which returns a `500` by default, a `409` for Prisma unique-constraint violations (`P2002`), and a `500` with a specific message for a missing database table (`P2021`).

## Screenshots

Screenshots will be added here.

## Future Improvements

> The following are suggestions only and are **not** implemented in the current codebase.

- Enforce role-based authorization (`ADMIN`-only checks) inside backend controllers rather than relying solely on frontend routing.
- Wire the existing `comments.js` controller to an actual route so task comments become usable.
- Provide an admin-facing way to change a user's role, rather than requiring a manual database update.
- Add automated tests (the backend `test` script is currently a placeholder).
- Add pagination on the backend for task-listing endpoints instead of returning full result sets.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes with clear messages.
4. Push to your fork and open a Pull Request describing the change.

## License

License: Not specified.

## Author

**Sahil Thakur**
GitHub: [https://github.com/Thakur2sahil](https://github.com/Thakur2sahil)
