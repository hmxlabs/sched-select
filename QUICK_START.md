# Quick Start Guide

## One-Command Setup

```bash
chmod +x setup.sh start.sh
./setup.sh
```

## Manual Setup

```bash
# 1. Create .env file (copy from below)
cp .env.example .env
# Edit .env with your database credentials

# 2. Install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Import data
python import_data.py

# 4. Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## .env File Template

Create `.env` file with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/scheduler_db
```

Or:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=scheduler_db
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production setup.

## API Endpoints

- Documentation: `http://localhost:8000/docs`
- Questions: `GET /questions`
- Answers: `GET /answers`
- Schedulers: `GET /schedulers`
- Save User Answers: `POST /user-answers/`
- Stats: `GET /user-answers/stats`

