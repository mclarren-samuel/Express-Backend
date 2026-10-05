# Docker Express App

Small Express API backed by MySQL, with Docker Compose for local development and CI checks for every pull request.

## Local setup

1. Copy `.env.example` to `.env`.
2. Replace both placeholder passwords with long, unique values. Do not commit `.env`.
3. Start the stack:

```sh
docker compose up --build
```

The API is available at `http://localhost:3000`. Use Postman to send requests to
that base URL.

Run the checks without Docker with `npm ci && npm run check && npm test`.

## Authentication

### 1. Create a Postman environment

Create an environment named `Docker Express Local` with:

| Variable | Initial value | Current value |
| --- | --- | --- |
| `baseUrl` | `http://localhost:3000` | `http://localhost:3000` |
| `token` | empty | empty |

Select this environment in the top-right of Postman.

### 2. Check the API health

Create a `GET` request with this URL:

```text
{{baseUrl}}/health
```

Send it and confirm that the response is `200 OK` with `{ "status": "ok" }`.

### 3. Register a user

Create a `POST` request:

```text
{{baseUrl}}/api/register
```

In **Body > raw**, choose **JSON** and enter:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "use-a-strong-password"
}
```

Send the request and expect `201 Created`.

### 4. Log in and save the token

Create a `POST` request:

```text
{{baseUrl}}/api/login
```

Use **Body > raw > JSON**:

```json
{
  "email": "ada@example.com",
  "password": "use-a-strong-password"
}
```

The response contains a short-lived JWT in the `token` field. Copy that value
into the environment's `token` variable as its current value.

### 5. Call the protected profile endpoint

Create a `GET` request:

```text
{{baseUrl}}/api/me
```

In the **Authorization** tab, choose **Bearer Token** and set the token to:

```text
{{token}}
```

Send the request and expect `200 OK` with the user's profile. Without the token,
the endpoint correctly returns `401 Unauthorized`.

Authentication answers "who are you?" with a verified token. Authorization answers "are you allowed to do this?" and should be added to each resource operation by checking the authenticated user's ownership or role.

## Push to GitHub

Create an empty repository on GitHub, then run the following from this directory:

```sh
git add .
git commit -m "Prepare Express API for production"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

Review `git diff --cached` before committing. Confirm that `.env`, logs, `node_modules`, and passwords are absent. GitHub Actions will run the syntax and smoke tests after the push.

## Production checklist

- Store database credentials in the deployment platform's secret manager, not in GitHub or Compose files.
- Put the API behind HTTPS and a reverse proxy or managed load balancer.
- Restrict MySQL to a private network; do not expose port `3306` publicly.
- Replace file logs with a centralized structured logging service and add request IDs.
- Add schema migrations, backups, restore drills, and a documented rollback procedure.
- Add authentication tokens, authorization rules, input validation, and integration tests before exposing user data.
- Pin and regularly update base images and npm dependencies, then scan images and dependencies in CI.
- Configure monitoring for latency, error rate, database health, saturation, and failed deployments.

## What deployment means

Deployment is the controlled process of moving a tested version of this application from source control into a running environment. A typical pipeline installs dependencies, runs checks and tests, builds the Docker image, supplies secrets from a secret manager, starts the API and database, runs health checks, and makes the API reachable through HTTPS. A rollback means selecting the previous known-good image when the new version fails its checks or causes errors.

This Compose setup is useful for development and small self-managed environments. For production, use a managed database where possible, keep the database on a private network, terminate HTTPS at a load balancer or reverse proxy, run at least two API instances when availability matters, and store backups outside the database host.