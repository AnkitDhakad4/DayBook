# DayBook backend

## Setup

1. Create a PostgreSQL database and copy its connection URL.
2. Run `schema.sql` against that database.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` and `ACCESS_TOKEN_SECRET`. Set `DATABASE_SSL=true` when your database provider requires TLS.
4. From this folder, run `npm install` and then `npm run dev`.

The backend connects directly to PostgreSQL with the `postgres` package. Keep the database URL and access-token secret out of source control.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | No | Health check |
| POST | `/api/v1/auth/register` | No | Create an account |
| POST | `/api/v1/auth/login` | No | Log in and receive a token cookie |
| POST | `/api/v1/auth/logout` | Yes | Clear the login cookie |
| GET | `/api/v1/auth/me` | Yes | Get the signed-in user |
| GET, POST | `/api/v1/tasks` | Yes | List or create tasks |
| GET, PATCH, DELETE | `/api/v1/tasks/:id` | Yes | Read, update, or delete a task |
| GET, POST | `/api/v1/projects` | Yes | List or create projects |
| GET, PATCH, DELETE | `/api/v1/projects/:id` | Yes | Read, update, or delete a project and its tasks |
| POST | `/api/v1/tasks/:taskId/subtasks` | Yes | Add a subtask |
| PATCH, DELETE | `/api/v1/tasks/:taskId/subtasks/:subtaskId` | Yes | Update or delete a subtask |
| GET | `/api/v1/stats` | Yes | Get task progress statistics |

The projects schema is included in `schema.sql` for a fresh database. For an existing database, run `migration_002_projects.sql` before starting the backend.

## Try registration and login

Start the server, then run:

```sh
curl -i -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Example","email":"alex@example.com","password":"secret123"}'
```

Log in and save the cookie:

```sh
curl -i -c cookies.txt -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"secret123"}'
```

Use `-b cookies.txt` on later requests to send the login cookie.
