# Books API - CI/CD Pipeline with MySQL

A Node.js/Express REST API with MySQL database, featuring a Repository Pattern architecture and complete CI/CD pipeline using GitHub Actions and Google Cloud Platform.

## 🚀 Live Demo

**API Base URL:** `http://34.87.37.112:4000`

Try it: `http://34.87.37.112:4000/books`

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [CI/CD Pipeline](#cicd-pipeline)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## ✨ Features

- ✅ RESTful API for managing books
- ✅ MySQL database with Repository Pattern
- ✅ Abstract base class (RepoBase) for repository methods
- ✅ Comprehensive test suite (22 tests)
- ✅ ESLint code quality checks
- ✅ Automated CI/CD pipeline
- ✅ Deployed on Google Cloud Platform
- ✅ Process management with PM2
- ✅ Search and filter functionality

---

## 🛠️ Tech Stack

**Backend:**
- Node.js 20.x
- Express.js
- MySQL 8.0
- mysql2 (Promise-based MySQL client)

**Architecture:**
- Repository Pattern
- Abstract Base Class (RepoBase)
- Dependency Injection

**Testing:**
- Jest
- Supertest
- MySQL Test Database

**CI/CD:**
- GitHub Actions
- Google Cloud Platform (GCP Compute Engine)
- PM2 Process Manager

**Code Quality:**
- ESLint

---

## 🏗️ Architecture

This project follows the **Repository Pattern** to separate data access logic from business logic:

```
┌─────────────────┐
│   Controllers   │  ← Handle HTTP requests/responses
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BookRepository │  ← Implements CRUD operations
└────────┬────────┘
         │ extends
         ▼
┌─────────────────┐
│    RepoBase     │  ← Abstract base class
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MySQL Database │  ← Data persistence
└─────────────────┘
```

### RepoBase Abstract Class

All repositories must implement these methods:
- `save(entity)` - Create a new record
- `retrieveAll(searchParams)` - Get all records with optional filtering
- `retrieveById(id)` - Get a single record by ID
- `update(entity)` - Update an existing record
- `delete(id)` - Delete a record by ID
- `deleteAll()` - Delete all records (⚠️ use with caution)

---

## 📡 API Endpoints

### Books Resource

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/books` | Get all books (supports filtering) |
| `GET` | `/books?author=...` | Filter books by author |
| `GET` | `/books?year=2024` | Filter books by year |
| `GET` | `/books?title=...` | Filter books by title |
| `GET` | `/books/:id` | Get a specific book |
| `POST` | `/books` | Create a new book |
| `PUT` | `/books/:id` | Replace a book |
| `PATCH` | `/books/:id` | Update a book |
| `DELETE` | `/books/:id` | Delete a book |
| `DELETE` | `/books` | Delete all books (⚠️ use with caution) |

### Book Schema

```json
{
  "id": 1,
  "title": "string (required)",
  "author": "string (required)",
  "year": "number (optional)",
  "summary": "string (optional)"
}
```

### Example Requests

**Create a Book:**
```bash
curl -X POST http://34.87.37.112:4000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925,
    "summary": "A classic American novel"
  }'
```

**Get All Books:**
```bash
curl http://34.87.37.112:4000/books
```

**Filter Books by Author:**
```bash
curl "http://34.87.37.112:4000/books?author=Fitzgerald"
```

**Get a Specific Book:**
```bash
curl http://34.87.37.112:4000/books/1
```

**Update a Book:**
```bash
curl -X PATCH http://34.87.37.112:4000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"year": 1926}'
```

**Delete a Book:**
```bash
curl -X DELETE http://34.87.37.112:4000/books/1
```

---

## 🔄 CI/CD Pipeline

### Continuous Integration (CI)

**Triggers:** Every push and pull request to `main` branch

**Jobs:**
1. **Test** (Node 18.x & 20.x)
   - Setup MySQL 8.0 service container
   - Checkout code
   - Install dependencies
   - Load database schema
   - Run Jest tests with coverage
   - Generate coverage report

2. **Lint**
   - Run ESLint code quality checks

### Continuous Deployment (CD)

**Triggers:** After successful CI on `main` branch

**Steps:**
1. SSH into GCP VM
2. Pull latest code from GitHub
3. Install/update dependencies
4. Setup/update MySQL database
5. Load database schema
6. Update environment variables
7. Restart PM2 application
8. Run health checks
9. Report deployment status

**Deployment Flow:**
```
Push to main → CI Tests (MySQL) → Lint Check → Deploy to GCP → MySQL Setup → Health Check → Live! 🎉
```

---

## 💻 Local Development

### Prerequisites

- Node.js 18.x or 20.x
- MySQL 8.0 or XAMPP/MAMP
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PasinduRavishan/simple-backend-CI-CD.git
   cd simple-backend-CI-CD
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup MySQL Database:**

   **Option A: Using XAMPP (Windows/Mac):**
   - Download and install [XAMPP](https://www.apachefriends.org/)
   - Start Apache and MySQL from XAMPP Control Panel
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `books_db`
   - Import the schema from `db/schema.sql`

   **Option B: Using MySQL CLI:**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE books_db;"
   mysql -u root -p -e "CREATE DATABASE books_db_test;"
   
   # Load schema
   mysql -u root -p books_db < db/schema.sql
   mysql -u root -p books_db_test < db/schema.sql
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   PORT=4000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=books_db
   DB_TEST_NAME=books_db_test
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Run tests:**
   ```bash
   npm test
   ```

7. **Run linting:**
   ```bash
   npm run lint
   ```

8. **Fix linting issues:**
   ```bash
   npm run lint:fix
   ```

---

## 🚢 Deployment

### Production Environment

**Server:** Google Cloud Platform (GCP Compute Engine)
- **Instance Type:** e2-micro (Free tier)
- **OS:** Ubuntu 22.04 LTS
- **Region:** us-central1
- **Database:** MySQL 8.0

### Manual Deployment Steps

1. **SSH into GCP VM:**
   ```bash
   gcloud compute ssh your-instance --zone=us-central1-a
   ```

2. **Navigate to app directory:**
   ```bash
   cd ~/apps/simple-backend-CI-CD
   ```

3. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

4. **Install dependencies:**
   ```bash
   npm ci --omit=dev
   ```

5. **Setup MySQL (if not already installed):**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mysql-server
   sudo systemctl start mysql
   sudo systemctl enable mysql
   
   # Create database and user
   sudo mysql -e "CREATE DATABASE books_db;"
   sudo mysql -e "CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';"
   sudo mysql -e "GRANT ALL PRIVILEGES ON books_db.* TO 'your_user'@'localhost';"
   sudo mysql -e "FLUSH PRIVILEGES;"
   
   # Load schema
   sudo mysql books_db < db/schema.sql
   ```

6. **Restart application:**
   ```bash
   pm2 restart backend-api
   ```

7. **Check status:**
   ```bash
   pm2 status
   pm2 logs backend-api
   ```

### GitHub Secrets Required

For automated deployment, add these secrets in GitHub repository settings:

- `GCP_SSH_PRIVATE_KEY` - SSH private key for VM access
- `GCP_VM_IP` - VM external IP address
- `GCP_VM_USER` - VM username
- `PORT` - Application port (4000)
- `DB_HOST` - MySQL host (localhost)
- `DB_PORT` - MySQL port (3306)
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Production database name (books_db)
- `DB_TEST_NAME` - Test database name (books_db_test)

---

## 📁 Project Structure

```
simple-backend-CI-CD/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Continuous Integration workflow
│       └── cd.yml               # Continuous Deployment workflow
├── controllers/
│   └── bookController.js        # HTTP request handlers
├── db/
│   ├── connection.js            # MySQL connection pool
│   └── schema.sql               # Database schema
├── repositories/
│   ├── RepoBase.js              # Abstract repository base class
│   └── BookRepository.js        # Book CRUD implementation
├── routes/
│   └── bookRoutes.js            # API route definitions
├── tests/
│   └── books.test.js            # Test suite (22 tests)
├── .eslintrc.json               # ESLint configuration
├── .eslintignore                # ESLint ignore rules
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment variables template
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

### Key Files

**Database Layer:**
- [db/connection.js](db/connection.js) - MySQL connection pool with Promise-based query execution
- [db/schema.sql](db/schema.sql) - Database schema for books table

**Repository Pattern:**
- [repositories/RepoBase.js](repositories/RepoBase.js) - Abstract base class defining repository contract
- [repositories/BookRepository.js](repositories/BookRepository.js) - Complete implementation of CRUD operations

**Application Layer:**
- [controllers/bookController.js](controllers/bookController.js) - HTTP request handlers using BookRepository
- [routes/bookRoutes.js](routes/bookRoutes.js) - API endpoint definitions
- [app.js](app.js) - Express middleware and route configuration
- [server.js](server.js) - Application entry point with MySQL connection initialization

---

## 🧪 Testing

**Test Suite:** 22 comprehensive tests covering:
- CRUD operations (Create, Read, Update, Delete)
- Search and filter functionality
- Input validation
- Error handling
- Edge cases
- HTTP status codes
- MySQL-specific behavior

**Run tests:**
```bash
npm test
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

**Test Database:**
Tests use a separate MySQL test database (`books_db_test`) that is automatically cleaned before each test.

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development` / `production` / `test` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Production database | `books_db` |
| `DB_TEST_NAME` | Test database | `books_db_test` |

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm test` | Run test suite with MySQL test database |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix linting issues |

---

## 🏗️ Database Schema

```sql
CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🎯 Design Patterns Used

1. **Repository Pattern**: Separates data access logic from business logic
2. **Abstract Base Class**: Defines contract for all repositories
3. **Dependency Injection**: Controllers receive repository instances
4. **Singleton Pattern**: Database connection pool is shared across the app
5. **Factory Pattern**: Connection pool creates connections as needed

---

## 🚀 Performance Features

- **Connection Pooling**: Reuses database connections (pool of 10)
- **Prepared Statements**: Protects against SQL injection via mysql2 parameterization
- **Efficient Queries**: Uses indexed primary keys for fast lookups
- **Process Management**: PM2 handles zero-downtime restarts
- **Health Checks**: Automated endpoint monitoring in CI/CD

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All contributions must:
- Pass all tests (`npm test`)
- Pass ESLint checks (`npm run lint`)
- Follow the Repository Pattern architecture

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Pasindu Ravishan**

GitHub: [@PasinduRavishan](https://github.com/PasinduRavishan)

---

## 🙏 Acknowledgments

- Node.js community
- Express.js framework
- MongoDB Atlas
- Google Cloud Platform
- GitHub Actions

---

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**⭐ If you find this project helpful, please give it a star!**
