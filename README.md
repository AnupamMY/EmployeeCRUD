# Employee Directory

Simple React + TypeScript frontend and Express + TypeScript API. Axios handles requests and MongoDB stores employees through Mongoose.

MongoDB is used because the supplied connection string is for MongoDB Atlas (Compass is a database client). This version does not use PostgreSQL or MySQL.

## Run locally

1. In `backend`, run `npm install`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Replace `<db_username>` and `<db_password>` in `.env` with your Atlas database user's password. URL-encode special characters in the password. Allow your IP in Atlas Network Access and ensure the database user can read and write `employee`.
4. In `backend`, run `npm run dev` (port 5000).
5. In a second terminal, open `frontend`, run `npm install`, then `npm run dev`.
6. Open `http://localhost:5173`.

Keep `.env` private. Do not commit database credentials. If the frontend uses another origin, update `CLIENT_ORIGIN` in the backend environment. To use a different API URL, copy `frontend/.env.example` to `frontend/.env` and update `VITE_API_URL`.

## API

Backend code is organized under `backend/src`:

- `server.ts` starts the server after connecting to MongoDB.
- `app.ts` configures Express, CORS, routes, and error handling.
- `config/db.ts` handles the database connection.
- `models/employeeModel.ts` defines the employee schema.
- `controllers/employeeController.ts` contains CRUD, validation, search, and pagination logic.
- `routes/employeeRoutes.ts` defines endpoints and checks employee IDs.
- `middleware/errorHandler.ts` handles API errors.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/employees?search=ann&page=1&limit=5` | Name search and pagination; returns `{ employees, total, page, totalPages }` |
| POST | `/employees` | Create an employee |
| PUT | `/employees/:id` | Update an employee |
| DELETE | `/employees/:id` | Delete an employee; returns 204 |

POST and PUT accept JSON: `{ "name": "Ann Lee", "email": "ann@example.com", "role": "Developer" }`.

Records contain `id`, `name`, `email`, `role`, and `created_at`. MongoDB's `_id` is returned as `id`. Email addresses must be unique. Search is case-insensitive and matches any part of a name. The default page size is 5, with a maximum of 100.

Run `npm run build` in `frontend` for the production build. The API requires a working MongoDB connection before it starts listening.

Validation: full name is required and allows up to 100 characters (including names longer than 32); email must have a valid address format and be at most 254 characters; job role is required and limited to 32 characters. Values are trimmed and email is stored in lowercase. Both create and update validate input.

Backend: `npm run dev` runs TypeScript with reload; `npm run build` compiles to `dist`; `npm start` runs the compiled server. Run `npm run typecheck` and `npm test` to verify the backend.
# EmployeeCRUD
