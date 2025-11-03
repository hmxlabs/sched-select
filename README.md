# Scheduler Selection API

Backend REST API for the Scheduler Selection Tool. This FastAPI application provides endpoints for managing questions, answers, schedulers, and user submissions.

## 🚀 Features

- **RESTful API**: FastAPI backend with PostgreSQL database
- **Question Management**: CRUD operations for questionnaire questions
- **Scheduler Data**: Access to HPC scheduler information and features
- **Answer Tracking**: Save and analyze user submissions (no authentication required)
- **Statistics**: Built-in analytics endpoint for answer breakdowns
- **Interactive Docs**: Automatic Swagger UI documentation
- **CORS Enabled**: Ready for frontend integration

## 🛠️ Tech Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server

## 📋 Prerequisites

- Python 3.9+
- PostgreSQL 12+
- Git

## 🏃 Quick Start

### Automated Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:hmxlabs/sched-select.git
   cd sched-select
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run automated setup**
   ```bash
   chmod +x setup.sh start.sh
   ./setup.sh
   ```

   This will:
   - Create virtual environment
   - Install Python dependencies
   - Set up PostgreSQL database
   - Import initial data (questions, answers, schedulers)

4. **Start the API server**
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   source venv/bin/activate
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

   API will be available at: `http://localhost:8000`
   API Documentation: `http://localhost:8000/docs`

### Manual Setup

See [QUICK_START.md](./QUICK_START.md) for step-by-step manual setup instructions.

## 📚 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/questions` | Get all questions with answer types |
| GET | `/answers` | Get all answer type definitions |
| GET | `/schedulers` | Get all schedulers with features |

### User Answers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user-answers/` | Save user answers (user_id optional) |
| GET | `/user-answers/` | List all saved answers (ordered by date) |
| GET | `/user-answers/stats` | Get statistics and answer breakdowns |

### Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/docs` | Interactive API documentation (Swagger UI) |
| GET | `/redoc` | Alternative API documentation (ReDoc) |

## 📖 API Usage Examples

### Get Questions

```javascript
fetch('http://localhost:8000/questions')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get Schedulers

```javascript
fetch('http://localhost:8000/schedulers')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Save User Answers

```javascript
fetch('http://localhost:8000/user-answers/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user_id: null,  // Optional - can be null or omitted
    answers: {
      "freeSoftware": true,
      "openSourceSoftware": false,
      "commercialSupport": true,
      "enterpriseFeatures": ["feature1", "feature2"],
      // ... all user answers
    }
  })
})
.then(res => res.json())
.then(data => console.log('Saved:', data));
```

### Get Statistics

```javascript
fetch('http://localhost:8000/user-answers/stats')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 📁 Project Structure

```
sched-select/
├── app/                      # FastAPI application
│   ├── data/                 # JSON data files
│   │   ├── questions.json    # Question definitions
│   │   ├── answers.json      # Answer type configurations
│   │   └── schedulers.json   # Scheduler information
│   ├── routers/              # API route handlers
│   │   ├── questions.py      # Question endpoints
│   │   ├── answers.py        # Answer type endpoints
│   │   ├── schedulers.py     # Scheduler endpoints
│   │   └── user_answer_router.py  # User answer endpoints
│   ├── models.py             # SQLAlchemy database models
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── crud.py               # Database CRUD operations
│   ├── db.py                 # Database configuration
│   ├── import_data.py        # Data import script
│   └── main.py               # FastAPI application entry point
├── setup.sh                  # Automated setup script
├── start.sh                  # Server startup script
├── import_data.py            # Standalone data import script
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
├── DEPLOYMENT.md             # Production deployment guide
└── QUICK_START.md            # Quick reference guide
```

## 🗄️ Database Schema

### Tables

- **questions**: Question definitions with answer type relationships
  - `id`, `question`, `hint`, `key`, `type`, `answer_type_id`
  
- **answer_types**: Answer type configurations
  - `id`, `key`, `type`, `options` (JSON)
  
- **schedulers**: Scheduler information and features
  - `id`, `name`, `product`, `owner`, `in_scope`, `score`, `link`, `description`, `features` (JSON)
  
- **user_answers**: User submissions for statistics
  - `id`, `user_id` (nullable), `answers` (JSON), `created_at`

## 🔧 Development

### Install Dependencies

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Add New Dependencies

```bash
pip install package_name
pip freeze > requirements.txt
```

### Import/Update Data

```bash
python import_data.py
```

### Run Development Server

```bash
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Tests

```bash
# When tests are implemented
pytest
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Option 1: Full connection string (recommended)
DATABASE_URL=postgresql://user:password@host:port/database_name

# Option 2: Individual variables (auto-constructed if DATABASE_URL not set)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=scheduler_db
```

**Note:** `DATABASE_URL` takes precedence if both are provided.

## 📊 Data Management

### Import Initial Data

```bash
python import_data.py
```

This imports:
- Answer types from `app/data/answers.json`
- Questions from `app/data/questions.json`
- Schedulers from `app/data/schedulers.json`

The script is **idempotent** - it won't duplicate existing data. It checks if data exists before importing.

### Update Data

1. Edit the JSON files in `app/data/`
2. Run `python import_data.py` again (it will skip existing records)
3. Or manually update the database via SQL or API

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions including:
- Server setup with systemd
- Nginx reverse proxy configuration
- SSL/HTTPS setup
- Docker deployment option

### Quick Production Setup

```bash
# On your server
git clone <repository-url>
cd sched-select
cp .env.example .env
# Edit .env with production credentials
chmod +x setup.sh
./setup.sh

# Start with multiple workers
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🌐 CORS Configuration

The API is configured to accept requests from any origin in development. For production, update `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Update this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 API Response Examples

### Questions Response

```json
[
  {
    "id": 1,
    "question": "Do you require a product that is free to use?",
    "hint": "If you are looking only for free to use...",
    "key": "freeSoftware",
    "type": "boolean",
    "answer_type": {
      "id": 1,
      "key": "freeSoftware",
      "type": "boolean",
      "options": [true, false]
    }
  }
]
```

### User Answer Save Response

```json
{
  "id": 1,
  "user_id": null,
  "answers": {
    "freeSoftware": true,
    "openSourceSoftware": false
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 🧪 Testing the API

### Using curl

```bash
# Get questions
curl http://localhost:8000/questions

# Save answers
curl -X POST http://localhost:8000/user-answers/ \
  -H "Content-Type: application/json" \
  -d '{"answers": {"freeSoftware": true}}'

# Get stats
curl http://localhost:8000/user-answers/stats
```

### Using the Interactive Docs

Visit `http://localhost:8000/docs` to test all endpoints directly in your browser.

## 🔍 Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d scheduler_db

# Check if database exists
psql -U postgres -l | grep scheduler_db
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 $(lsof -ti:8000)
```

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🔗 Related Repositories

- Frontend Application: (link to frontend repo if available)

## 📞 Support

For issues or questions:
- Check API documentation at `/docs` endpoint
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- See [QUICK_START.md](./QUICK_START.md) for setup help

## 📚 Documentation Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

Built with ❤️ by HMXLabs
