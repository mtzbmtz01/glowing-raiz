# Deployment Guide

This guide covers different deployment options for the Raiz dating app.

## Prerequisites

- Domain name (for production)
- SSL certificate (Let's Encrypt recommended)
- Server with Node.js 18+ (for production)
- PostgreSQL database (managed or self-hosted)

## Development Deployment

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/mtzbmtz01/glowing-raiz.git
cd glowing-raiz

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Setup

```bash
# Install dependencies
npm run install:all

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your settings

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start backend
npm run dev

# In another terminal, start mobile
cd ../mobile
npm start
```

## Production Deployment

### Option 1: Cloud Platform (Recommended for Beginners)

#### Backend on Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
cd backend
heroku create raiz-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set FRONTEND_URL="https://yourdomain.com"

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate
```

#### Backend on Railway.app

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Add PostgreSQL service
6. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `JWT_SECRET`
   - `PORT` (auto-set by Railway)
   - `FRONTEND_URL`
7. Deploy

#### Mobile App via Expo EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
cd mobile
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Option 2: VPS Deployment (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Install Certbot (for SSL)
apt install -y certbot python3-certbot-nginx
```

#### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE raiz_db;
CREATE USER raiz_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE raiz_db TO raiz_user;
\q
```

#### 3. Application Setup

```bash
# Clone repository
cd /var/www
git clone https://github.com/mtzbmtz01/glowing-raiz.git
cd glowing-raiz/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://raiz_user:secure_password@localhost:5432/raiz_db"
JWT_SECRET="your-secure-jwt-secret"
PORT=3000
FRONTEND_URL="https://yourdomain.com"
EOF

# Generate Prisma client and migrate
npm run prisma:generate
npm run prisma:migrate

# Build
npm run build

# Start with PM2
pm2 start dist/index.js --name raiz-api
pm2 save
pm2 startup
```

#### 4. Nginx Configuration

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/raiz << 'EOF'
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/raiz /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Get SSL certificate
certbot --nginx -d api.yourdomain.com
```

#### 5. Mobile App Update

Update API URLs in mobile app:
```typescript
// mobile/src/services/api.ts
const API_URL = 'https://api.yourdomain.com/api';

// mobile/src/services/socket.ts
const SOCKET_URL = 'https://api.yourdomain.com';
```

### Option 3: Docker Deployment

#### 1. Build Images

```bash
# Build backend
cd backend
docker build -t raiz-backend .

# Tag for registry
docker tag raiz-backend your-registry/raiz-backend:latest

# Push to registry
docker push your-registry/raiz-backend:latest
```

#### 2. Deploy with Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    image: your-registry/raiz-backend:latest
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: always

volumes:
  postgres_data:
```

```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

### Backend Required

```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-secret-key-min-32-chars"
PORT=3000
FRONTEND_URL="https://yourdomain.com"
```

### Backend Optional (OAuth)

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_KEY_ID="your-apple-key-id"
APPLE_PRIVATE_KEY_PATH="./apple-key.p8"
```

## Post-Deployment Checklist

### Backend
- [ ] Database is accessible
- [ ] Migrations have run successfully
- [ ] Environment variables are set
- [ ] API is accessible via HTTPS
- [ ] WebSocket connections work
- [ ] Rate limiting is active
- [ ] Logs are being collected
- [ ] Backups are configured

### Mobile App
- [ ] API URLs point to production
- [ ] App builds successfully
- [ ] OAuth redirect URIs are configured
- [ ] Push notification certificates added
- [ ] App icons and splash screens updated
- [ ] App submitted to stores
- [ ] Privacy policy URL added
- [ ] Terms of service URL added

### Security
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] JWT secret is secure and unique
- [ ] CORS configured correctly
- [ ] Rate limiting tested
- [ ] Input validation working
- [ ] Logs don't contain sensitive data

### Monitoring
- [ ] Error tracking setup (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database monitoring
- [ ] Disk space alerts
- [ ] Log aggregation

## Scaling Considerations

### Horizontal Scaling

```nginx
# Nginx load balancer
upstream raiz_backend {
    least_conn;
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    location / {
        proxy_pass http://raiz_backend;
    }
}
```

### Redis for Socket.IO

```typescript
// backend/src/index.ts
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_profile_location ON "Profile" (latitude, longitude);
CREATE INDEX idx_message_users ON "Message" (sender_id, receiver_id);
CREATE INDEX idx_message_created ON "Message" (created_at DESC);

-- Connection pooling in Prisma
-- DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20"
```

## Backup Strategy

### Database Backups

```bash
# Automated daily backup
cat > /etc/cron.daily/backup-raiz << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U raiz_user raiz_db > /backups/raiz_$DATE.sql
find /backups -name "raiz_*.sql" -mtime +7 -delete
EOF

chmod +x /etc/cron.daily/backup-raiz
```

### Application Backups

```bash
# Backup application files
tar -czf raiz-app-backup.tar.gz /var/www/glowing-raiz
```

## Monitoring

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs raiz-api

# Monitor metrics
pm2 monit
```

### Health Check Endpoint

Already implemented at `/health`:

```bash
curl https://api.yourdomain.com/health
# Returns: {"status":"ok"}
```

## Troubleshooting

### Backend Issues

**Service won't start:**
```bash
pm2 logs raiz-api
# Check for errors in logs
```

**Database connection fails:**
```bash
# Test connection
psql $DATABASE_URL
# Verify credentials and network access
```

**High memory usage:**
```bash
pm2 restart raiz-api
# Consider increasing server resources
```

### Mobile App Issues

**Can't connect to API:**
- Verify API URL is correct
- Check SSL certificate validity
- Test API endpoint in browser

**Build fails:**
```bash
# Clear cache and rebuild
cd mobile
rm -rf node_modules
npm install
expo start -c
```

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test database connectivity
4. Check firewall rules
5. Review Nginx configuration
6. Open an issue on GitHub

## Additional Resources

- [Expo Deployment Guide](https://docs.expo.dev/distribution/introduction/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
