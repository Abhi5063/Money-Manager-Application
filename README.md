# 💰 Money Manager Application

A **production-ready, full-stack personal finance management system** built with Spring Boot and React.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 Features

- **JWT Authentication** — Secure register / login with BCrypt passwords
- **Transactions CRUD** — Add, edit, delete income & expense records
- **Smart Filtering** — Filter by date range and category
- **Dashboard Analytics** — Bar chart (6-month income vs expense), Pie chart (spending by category)
- **Budget Tracking** — Set monthly limits per category with progress indicators + overspend alerts
- **Category Management** — Custom income/expense categories with emoji icons
- **CSV Export** — Download all or filtered transactions as a spreadsheet
- **Weekly Email Summary** — Scheduled email every Monday with weekly finance recap
- **Swagger UI** — Full API documentation at `/swagger-ui.html`
- **H2 in-memory DB (dev)** — Zero config to run locally; PostgreSQL ready for production

---

## 📁 Project Structure

```
money-manager/
├── backend/       # Spring Boot (Maven)
│   └── src/main/java/com/moneymanager/
│       ├── config/        # Security, CORS configuration
│       ├── controller/    # REST API endpoints
│       ├── dto/           # Request / Response objects
│       ├── entity/        # JPA entities
│       ├── exception/     # Global error handling
│       ├── repository/    # Spring Data JPA
│       ├── scheduler/     # Weekly email task
│       ├── security/      # JWT filter, UserDetailsService
│       └── service/       # Business logic
└── frontend/      # React + Vite + Tailwind CSS
    └── src/
        ├── api/           # Axios + API modules
        ├── components/    # Layout, ProtectedRoute
        ├── context/       # AuthContext
        └── pages/         # Dashboard, Transactions, Categories, Budget, Reports
```

---

## ⚙️ Backend Setup

### Prerequisites
- Java 17+
- Maven 3.8+

### Run Locally

```bash
cd backend
mvn spring-boot:run
```

The server starts at **http://localhost:8080**

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console (use `jdbc:h2:mem:moneymanagerdb`, username `sa`, password `password`)

### Environment Variables (Production)

Set these for production deployment:

| Variable | Description |
|---|---|
| `JWT_SECRET` | 64+ char hex string for JWT signing |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `MAIL_HOST` | SMTP host (e.g. smtp.gmail.com) |
| `MAIL_PORT` | SMTP port (587) |
| `MAIL_USERNAME` | SMTP username |
| `MAIL_PASSWORD` | SMTP password / app password |
| `FRONTEND_URL` | Deployed frontend URL for CORS |

---

## ⚙️ Frontend Setup

### Prerequisites
- Node.js 18+

### Run Locally

```bash
cd frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**

### Environment Variables

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

For production, set `VITE_API_BASE_URL` to your deployed backend URL.

---

## 🗃️ API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login & get JWT |
| `/api/auth/me` | GET | Get current user profile |
| `/api/transactions` | GET | List transactions (filters: `from`, `to`, `categoryId`) |
| `/api/transactions` | POST | Create transaction |
| `/api/transactions/{id}` | PUT | Update transaction |
| `/api/transactions/{id}` | DELETE | Delete transaction |
| `/api/categories` | GET/POST/PUT/DELETE | Category management |
| `/api/budgets` | GET | List budgets (filters: `month`, `year`) |
| `/api/budgets` | POST | Set budget |
| `/api/budgets/{id}` | PUT | Update budget |
| `/api/dashboard` | GET | Dashboard data (summary + charts) |
| `/api/reports/export/csv` | GET | Export CSV report |

> Full interactive docs at `http://localhost:8080/swagger-ui.html`

---

## ☁️ Deployment

### Backend → Render / Railway

1. Push to GitHub (already done)
2. Create a new Web Service on [Render](https://render.com) / [Railway](https://railway.app)
3. Connect your GitHub repo, set root directory to `backend`
4. Build command: `mvn clean package -DskipTests`
5. Start command: `java -jar target/money-manager-backend-1.0.0.jar`
6. Add environment variables listed above
7. Add a PostgreSQL database addon and set `SPRING_DATASOURCE_*` vars

### Frontend → Vercel / Netlify

1. Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Import the GitHub repo, set root directory to `frontend`
3. Build command: `npm run build`, output dir: `dist`
4. Add env var: `VITE_API_BASE_URL=<your-backend-url>`

---

## 🛠️ Tech Stack

**Backend**
- Spring Boot 3.2 · Spring Security · JJWT
- Spring Data JPA · H2 (dev) · PostgreSQL (prod)
- SpringDoc OpenAPI · Spring Mail · Lombok

**Frontend**
- React 18 · Vite · Tailwind CSS 3
- React Router v6 · Axios · Recharts
- React Hook Form · Yup · React Hot Toast · React Icons

---

## 📝 License

MIT © 2026 Abhi5063
