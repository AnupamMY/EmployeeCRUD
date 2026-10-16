# Employee Directory

A simple app to add, view, edit, delete, and search employees.

Built with React, TypeScript, Express, and MongoDB.

## Setup

Install Node.js and have a MongoDB connection string ready.

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `MONGODB_URI` to your MongoDB connection string. For Atlas, use your database credentials and allow your IP in Network Access.

Start the backend from the project folder:

```sh
cd backend
npm install
npm run dev
```

Open another terminal in the project folder and start the frontend:

```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Keep both terminals running.

## Input rules

- Full name: required, up to 100 characters.
- Email: required, valid, and unique.
- Job role: required, up to 32 characters.

Keep your `.env` file private.

Git repo link 
https://github.com/AnupamMY/EmployeeCRUD.git