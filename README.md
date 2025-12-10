# Books API - CI/CD Pipeline Demo

A simple Node.js/Express REST API with MongoDB, featuring a complete CI/CD pipeline using GitHub Actions and Google Cloud Platform.

## 🚀 Live Demo

**API Base URL:** `http://34.87.37.112:4000`

Try it: `http://34.87.37.112:4000/books`

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [CI/CD Pipeline](#cicd-pipeline)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## ✨ Features

- ✅ RESTful API for managing books
- ✅ MongoDB database integration
- ✅ Comprehensive test suite (21 tests)
- ✅ ESLint code quality checks
- ✅ Automated CI/CD pipeline
- ✅ Deployed on Google Cloud Platform
- ✅ Process management with PM2

---

## 🛠️ Tech Stack

**Backend:**
- Node.js 20.x
- Express.js
- MongoDB (Atlas)
- Mongoose ODM

**Testing:**
- Jest
- Supertest
- MongoDB Memory Server

**CI/CD:**
- GitHub Actions
- Google Cloud Platform (GCP Compute Engine)
- PM2 Process Manager

**Code Quality:**
- ESLint

---

## 📡 API Endpoints

### Books Resource

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/books` | Get all books |
| `GET` | `/books/:id` | Get a specific book |
| `POST` | `/books` | Create a new book |
| `PUT` | `/books/:id` | Replace a book |
| `PATCH` | `/books/:id` | Update a book |
| `DELETE` | `/books/:id` | Delete a book |

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

**Get a Specific Book:**
```bash
curl http://34.87.37.112:4000/books/{book_id}
```

**Update a Book:**
```bash
curl -X PATCH http://34.87.37.112:4000/books/{book_id} \
  -H "Content-Type: application/json" \
  -d '{"year": 1926}'
```

**Delete a Book:**
```bash
curl -X DELETE http://34.87.37.112:4000/books/{book_id}
```

---

## 🔄 CI/CD Pipeline

### Continuous Integration (CI)

**Triggers:** Every push and pull request to `main` branch

**Jobs:**
1. **Test** (Node 18.x & 20.x)
   - Checkout code
   - Install dependencies
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
4. Update environment variables
5. Restart PM2 application
6. Run health checks
7. Report deployment status

**Deployment Flow:**
```
Push to main → CI Tests → Lint Check → Deploy to GCP → Health Check → Live! 🎉
```

---

## 💻 Local Development

### Prerequisites

- Node.js 18.x or 20.x
- MongoDB (or MongoDB Atlas account)
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

3. **Create `.env` file:**
   ```bash
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

6. **Run linting:**
   ```bash
   npm run lint
   ```

7. **Fix linting issues:**
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

5. **Restart application:**
   ```bash
   pm2 restart backend-api
   ```

6. **Check status:**
   ```bash
   pm2 status
   pm2 logs backend-api
   ```

### GitHub Secrets Required

For automated deployment, add these secrets in GitHub repository settings:

- `GCP_SSH_PRIVATE_KEY` - SSH private key for VM access
- `GCP_VM_IP` - VM external IP address
- `GCP_VM_USER` - VM username
- `MONGO_URI` - MongoDB connection string
- `PORT` - Application port (4000)

---

## 📁 Project Structure

```
simple-backend-CI-CD/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Continuous Integration workflow
│       └── cd.yml          # Continuous Deployment workflow
├── config/
│   └── db.js               # Database connection
├── controllers/
│   └── bookController.js   # Book CRUD operations
├── models/
│   └── book.model.js       # Mongoose Book schema
├── routes/
│   └── bookRoutes.js       # API route definitions
├── tests/
│   └── books.test.js       # Test suite (21 tests)
├── .eslintrc.json          # ESLint configuration
├── .eslintignore           # ESLint ignore rules
├── .gitignore              # Git ignore rules
├── app.js                  # Express app setup
├── server.js               # Server entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

---

## 🧪 Testing

**Test Suite:** 21 comprehensive tests covering:
- CRUD operations
- Input validation
- Error handling
- Edge cases
- API status codes

**Run tests:**
```bash
npm test
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

**Current Coverage:**
- Models: 100%
- Routes: 100%
- Controllers: ~10% (basic paths tested)

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NODE_ENV` | Environment mode | `development` / `production` / `test` |

---

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm test` | Run test suite |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix linting issues |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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
