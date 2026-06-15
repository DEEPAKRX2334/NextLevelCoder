# NextLevelCoder - Full-Stack Application Deployment Guide

NextLevelCoder is an interactive coding syllabus and sandbox playground. This guide details how to build, run, and deploy the application in production environments.

## Architecture Overview

- **Frontend**: React + TypeScript + Vite + TailwindCSS. Deployed on **Vercel**.
- **Backend**: Java 17 + Spring Boot 3.2 + JPA + Spring Security (JWT). Deployed on **Render**.
- **Database**: MySQL. Can be hosted on Render Managed MySQL, AWS RDS, PlanetScale, Aiven, or similar providers.

---

## Directory Structure

```text
NextLevelCoder/
├── frontend/               # React client application
│   ├── vercel.json         # Vercel SPA routing configuration
│   ├── .env.production     # Production variables template
│   └── package.json
└── backend/                # Spring Boot REST API
    ├── Dockerfile          # Multi-stage container definition
    ├── pom.xml
    └── src/main/resources/application.properties
```

---

## Environment Variables Reference

### Frontend (Vercel Configuration)
Configure this variable in the **Environment Variables** tab of your Vercel project:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | The production URL of your backend REST API | `https://nextlevelcoder-api.onrender.com/api` |

### Backend (Render Configuration)
Configure these variables in your Render Web Service settings (Environment section):

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `PORT` | The port the backend listens on (Render binds this automatically) | `8080` (or dynamic) |
| `SPRING_DATASOURCE_URL` | Complete JDBC database connection string | `jdbc:mysql://<host>:<port>/<dbname>?useSSL=true` |
| `DB_USER` | MySQL database username | `root` |
| `DB_PASSWORD` | MySQL database password | `your_secure_password` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `https://next-level-coder.vercel.app` |
| `JWT_SECRET` | Secret key used for signing JWT authentication tokens | *A random 64-character hex string* |

---

## Deployment Steps

### 1. Database Provisioning
1. Spin up a MySQL instance on your database provider.
2. Ensure you have the host name, database name, username, and password ready.
3. If using Render Managed MySQL, the provider will automatically supply an external connection string.

### 2. Backend Deployment on Render
1. Connect your GitHub repository to Render.
2. Choose **New > Web Service**.
3. Select the repository and select **Docker** as the Runtime (Render will automatically detect the `backend/Dockerfile` if configured, or you can specify the Dockerfile path `backend/Dockerfile` and Build Context as `backend`).
4. Under **Environment**, add the variables listed in the *Backend* table above.
5. Deploy. Render will build the container and deploy the Spring Boot app.

### 3. Frontend Deployment on Vercel
1. Connect your repository to Vercel.
2. Select **New Project** and import the repository.
3. Configure the Root Directory to **`frontend`**.
4. Vercel will auto-detect **Vite** as the framework.
5. Expand the **Environment Variables** block and add:
   - Name: `VITE_API_URL`
   - Value: `https://<your-render-app-name>.onrender.com/api`
6. Click **Deploy**. Vercel will automatically build the static assets and deploy the SPA.

---

## Local Development Execution

### Run Database
Ensure a local MySQL instance is running on port `3306` with credentials matching those in your `application.properties` (or supply them via local environment variables).

### Run Backend
Navigate to the `backend` directory and execute:
```bash
mvn spring-boot:run
```

### Run Frontend
Navigate to the `frontend` directory, install dependencies, and start the development server:
```bash
npm install
npm run dev
```
The site will be available at [http://localhost:5173](http://localhost:5173).
