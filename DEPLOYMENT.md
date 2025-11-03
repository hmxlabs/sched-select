# Deployment Guide

This guide explains how to deploy the Scheduler Selection API to a production server.

## Prerequisites

- Python 3.9 or higher
- PostgreSQL 12 or higher
- Git
- Server with SSH access

## Quick Setup on Fresh Server

### 1. Clone the Repository

```bash
git clone git@github.com:hmxlabs/sched-select.git
cd sched-select
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
nano .env  # or use your preferred editor
```

Update the `.env` file with your database credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/scheduler_db
```

Or use individual variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=scheduler_db
```

### 3. Run Setup Script

Make scripts executable and run setup:

```bash
chmod +x setup.sh start.sh
./setup.sh
```

This will:
- ✅ Check PostgreSQL connection
- ✅ Create database if it doesn't exist
- ✅ Create virtual environment
- ✅ Install dependencies
- ✅ Import initial data (questions, answers, schedulers)

### 4. Start the Server

#### Development Mode

```bash
./start.sh
```

Or manually:

```bash
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Production Mode

```bash
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Manual Setup (Step by Step)

If you prefer to set up manually:

### 1. Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Set Up PostgreSQL

```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE scheduler_db;"
sudo -u postgres psql -c "CREATE USER your_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE scheduler_db TO your_user;"
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Import Data

```bash
source venv/bin/activate
python import_data.py
```

### 5. Start Server

```bash
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Production Deployment with Systemd

### 1. Create Systemd Service File

Create `/etc/systemd/system/scheduler-api.service`:

```ini
[Unit]
Description=Scheduler Selection API
After=network.target postgresql.service

[Service]
User=your_user
Group=your_group
WorkingDirectory=/path/to/sched-select
Environment="PATH=/path/to/sched-select/venv/bin"
ExecStart=/path/to/sched-select/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 2. Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable scheduler-api
sudo systemctl start scheduler-api
sudo systemctl status scheduler-api
```

### 3. View Logs

```bash
sudo journalctl -u scheduler-api -f
```

## Production Deployment with Docker (Optional)

### 1. Create Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/scheduler_db
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=scheduler_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Run with Docker Compose

```bash
docker-compose up -d
```

## Using Nginx as Reverse Proxy

### 1. Install Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

### 2. Configure Nginx

Create `/etc/nginx/sites-available/scheduler-api`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/scheduler-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/HTTPS Setup (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

### Required Variables

- `DATABASE_URL` - Full PostgreSQL connection string (or use individual DB_* variables)

### Optional Variables

If `DATABASE_URL` is not set, these will be used:
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

## API Endpoints

Once deployed, your API will be available at:

- `GET /` - API information
- `GET /questions` - Get all questions
- `GET /answers` - Get all answer types
- `GET /schedulers` - Get all schedulers
- `POST /user-answers/` - Save user answers
- `GET /user-answers/` - List all saved answers
- `GET /user-answers/stats` - Get statistics
- `GET /docs` - Interactive API documentation (Swagger UI)

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Update dependencies if needed
pip install -r requirements.txt

# Import new data if needed
python import_data.py

# Restart the service
sudo systemctl restart scheduler-api
```

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d scheduler_db

# Check if database exists
psql -U postgres -l | grep scheduler_db
```

### Permission Issues

```bash
# Make scripts executable
chmod +x setup.sh start.sh import_data.py

# Fix file permissions
chown -R user:group /path/to/sched-select
```

### View Application Logs

```bash
# If using systemd
sudo journalctl -u scheduler-api -f

# If running manually
# Logs will appear in terminal
```

## Security Considerations

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use strong database passwords**
3. **Configure firewall** - Only allow necessary ports
4. **Use HTTPS** in production
5. **Limit CORS origins** - Update `allow_origins` in `main.py` for production
6. **Keep dependencies updated** - Regularly run `pip install --upgrade -r requirements.txt`

## Support

For issues or questions, please check:
- API documentation at `/docs` endpoint
- GitHub issues (if applicable)

