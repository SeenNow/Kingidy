````markdown
# Kingidy — GCP Deployment Guide (GCS + Cloud Run)

This guide describes how to host the Vite frontend on Google Cloud Storage (GCS) with Cloud CDN and host the GraphQL/Node backend on Cloud Run. It includes Cloud SQL for production Prisma deployments and a path-based HTTP(S) Load Balancer for a single entry point.
### Quick summary

- Frontend: Vite (public root) -> `dist/` -> GCS bucket + Cloud CDN
- Backend: `server/` (Node + GraphQL) -> Container -> Cloud Run
- Database: Cloud SQL (Postgres) for Prisma production
- Load Balancing: HTTPS Load Balancer with path-based routing (`/graphql` -> Cloud Run; `/*` -> GCS bucket)
> NOTE: this guide focuses on deploying to Google Cloud (GCS/Cloud Run). The original file included examples for Netlify/Vercel/etc — those are still valid options if you prefer them.
---

## Environment variables and placeholders
Replace placeholders below with appropriate values for your project. Example shows `kingAI` as your GCP project.

PowerShell example variables (local usage for convenience):
```powershell
$PROJECT_ID = "kingai"  # Your GCP Project ID
$REGION = "us-central1"
$FRONTEND_BUCKET = "kingidy-frontend-$PROJECT_ID"
$SERVICE_NAME = "kingidy-server"
$IMAGE_NAME = "kingidy-server"
$DB_INSTANCE = "kingidy-db"
$DB_NAME = "kingidy"
$DB_USER = "postgres"
$DB_PASS = "CHANGE_ME"
$DOMAIN = "example.com"  # Optional custom domain for LB
```

---

## 1) Prerequisites
- Install gcloud and authenticate, then select project and region:
```powershell
gcloud auth login
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION
```

- Enable required APIs:
```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com compute.googleapis.com sqladmin.googleapis.com storage.googleapis.com secretmanager.googleapis.com
```

---

## 2) Build Frontend (Vite)
From the repo root:
```powershell
npm ci
npm run build
ls .\dist\  # verify files present
```

Vite outputs into `dist/` (per `vite.config.ts` root => `./public`).

---

## 3) Create and Upload to GCS Bucket
Create a GCS bucket, then upload built files:
```powershell
gsutil mb -p $PROJECT_ID -l $REGION gs://$FRONTEND_BUCKET
# Make public if you want direct access (optional, otherwise keep private and serve via LB)
gsutil iam ch allUsers:objectViewer gs://$FRONTEND_BUCKET  # optional
gsutil -m rsync -r .\dist gs://$FRONTEND_BUCKET
```

If you plan to front the site with an HTTPS LB, keep the bucket private and use the LB's backend bucket.

---

## 4) Add Cloud CDN to a Backend Bucket (for Load Balancer)
```powershell
gcloud compute backend-buckets create frontend-backend --gcs-bucket-name=$FRONTEND_BUCKET --enable-cdn --project=$PROJECT_ID
```

---

## 5) Containerize Backend & Deploy to Cloud Run (server/)
Create `server/Dockerfile` in the repo (example below) and deploy the service to Cloud Run.

Example `server/Dockerfile`:
```dockerfile
# server/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++ bash
COPY server/package*.json server/package-lock.json ./
RUN npm ci --prefix server
COPY server/ ./server
WORKDIR /app/server
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache bash
ENV NODE_ENV=production
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/node_modules ./node_modules
COPY --from=build /app/server/prisma ./prisma
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

Build & push to GCR (Container Registry) via Cloud Build:
```powershell
gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME
```

Deploy to Cloud Run:
```powershell
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME `
  --region $REGION `
  --platform managed `
  --allow-unauthenticated `
  --set-env-vars=NODE_ENV=production,PORT=8080
```

Cloud Run supports runtime port via `PORT` env var; `server/src/index.ts` uses `process.env.PORT || 4000`.

---

## 6) Upgrade Prisma to Cloud SQL (Postgres) for production
Your current `schema.prisma` uses SQLite; switch to Postgres for production and Cloud SQL.

Modify `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Create Cloud SQL (Postgres):
```powershell
gcloud sql instances create $DB_INSTANCE --database-version=POSTGRES_15 --tier=db-f1-micro --region=$REGION --project=$PROJECT_ID
gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE
gcloud sql users set-password $DB_USER --instance=$DB_INSTANCE --password=$DB_PASS
```

Get Cloud SQL connection name and set `DATABASE_URL`. Use the Cloud SQL Unix socket path when using Cloud Run:
```powershell
$CONNECTION_NAME = "$PROJECT_ID:$REGION:$DB_INSTANCE"
$DATABASE_URL = "postgresql://$DB_USER:$DB_PASS@/$DB_NAME?host=/cloudsql/$CONNECTION_NAME"
```

Store `DATABASE_URL` in Secret Manager:
```powershell
echo $DATABASE_URL | gcloud secrets create DATABASE_URL --data-file=- || echo $DATABASE_URL | gcloud secrets versions add DATABASE_URL --data-file=-
```

Give the Cloud Run service account `roles/cloudsql.client` and `roles/secretmanager.secretAccessor`.

Deploy Cloud Run with Cloud SQL mount and secrets:
```powershell
gcloud run deploy $SERVICE_NAME --image gcr.io/$PROJECT_ID/$IMAGE_NAME `
  --region $REGION --platform managed --allow-unauthenticated `
  --add-cloudsql-instances=$CONNECTION_NAME `
  --set-secrets=DATABASE_URL=DATABASE_URL:latest
```

Run Prisma migrations (example, run in CI or once from your machine):
```powershell
cd server
npx prisma migrate deploy
npx prisma generate
```

---

## 7) Setup HTTPS Load Balancer with path-based routing (GCS + Cloud Run)
Use the GCP Console for a simpler experience. Key components:
- Reserve a global static IP
- Create a Backend Bucket (GCS bucket) with CDN (we used `frontend-backend`)
- Create a Serverless NEG for Cloud Run service (serverless NEG)
- Create a URL Map: route `/graphql` and `/api/*` to Cloud Run NEG; `/*` to backend bucket
- Add an HTTPS frontend with a managed certificate and the domain

If you want a CLI hint, refer to GCP docs for "Load balancing for serverless services" — the Console is straightforward for mapping Serverless backends and backend buckets.

---

## 8) DNS & Domain
Once your LB has a static IP, set an A record in DNS for your domain to point to the static IP.

---

## 9) CORS and Security
Set CORS on your Node/Express server to accept your domain and route `/graphql`:
```js
import cors from 'cors';
app.use(cors({ origin: 'https://yourdomain.com' }));
```

Use Secret Manager for sensitive values, and restrict Cloud Run IAM and Cloud SQL access to the service account.

---

## 10) GitHub Actions CI/CD (example)
Place `.github/workflows/deploy.yml` to upload frontend files to GCS and deploy backend to Cloud Run.

```yaml
name: Deploy to GCP

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Build frontend
        run: |
          npm ci
          npm run build

      - name: Authenticate to GCP
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Upload frontend to GCS
        run: |
          gsutil -m rsync -r ./dist gs://$FRONTEND_BUCKET

      - name: Build and push server image
        run: |
          cd server
          gcloud builds submit --tag gcr.io/$PROJECT_ID/$IMAGE_NAME

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE_NAME --image gcr.io/$PROJECT_ID/$IMAGE_NAME \
            --region $REGION --platform managed --allow-unauthenticated \
            --add-cloudsql-instances=$CONNECTION_NAME \
            --set-secrets=DATABASE_URL=DATABASE_URL:latest
```

Add required GitHub secrets: `GCP_SA_KEY`, `PROJECT_ID`, `FRONTEND_BUCKET`, `CONNECTION_NAME`, etc.

---

## 11) Troubleshooting & Gotchas
- SQLite is not suitable for production on Cloud Run (instances are ephemeral). Use Cloud SQL for persistent DB storage.
- Ensure your Cloud Run service account has `roles/cloudsql.client` and `roles/secretmanager.secretAccessor`.
- Use the Console to configure LB mapping between Cloud Run and GCS for easier set up.
- Configure CORS and set proper cache-control headers for the GCS files.

---

## 12) Monitoring & Logging
- Use Cloud Logs for Cloud Run logs
- Use Cloud Monitoring for uptime/latency
- Integrate Sentry or similar for frontend runtime errors

---

## Optional: Additional steps I can do for you
If you want I can also:
1. Create `server/Dockerfile` in the repository.
2. Add a script `cloud-run-deploy.sh` that runs the Cloud Build + Cloud Run deploy.
3. Create a sample `deploy.yml` GitHub Actions workflow in `.github/workflows/`.
4. Walk you through creating the load balancer in the Console interactively.

Pick which options you'd like me to perform, and I will implement them directly in the repo.
# Deployment Guide

## Overview

This guide covers various deployment options for the Kingidy web application.

## Build for Production

Before deploying, create a production build:

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

## Deployment Options

### 1. Static Hosting (Recommended for Web App)

The application is a static web app and can be deployed to any static hosting service.

#### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

#### GitHub Pages

1. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/kingidy",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Deploy:
```bash
npm run deploy
```

#### AWS S3 + CloudFront

1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist/` contents to S3
4. Configure CloudFront distribution (optional, for CDN)

#### Azure Static Web Apps

1. Create Azure Static Web App
2. Connect to GitHub repository
3. Configure build:
   - App location: `/`
   - Output location: `dist`
   - Build command: `npm run build`

### 2. Docker Deployment

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t kingidy .
docker run -p 8080:80 kingidy
```

### 3. Traditional Web Server

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/kingidy/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache

Create `.htaccess` in `dist/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Environment Configuration

### Development
```bash
npm start
```
Runs on `http://localhost:3000`

### Production
Set environment variables if needed:
```bash
NODE_ENV=production npm run build
```

## Performance Optimization

### 1. Code Splitting
Already implemented with webpack dynamic imports for PDF.js.

### 2. Compression
Enable gzip/brotli compression on your server:

**Nginx:**
```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. CDN
Use a CDN for static assets:
- Cloudflare
- AWS CloudFront
- Azure CDN

### 4. Caching
Set cache headers for static assets:

**Nginx:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Security Best Practices

### 1. HTTPS
Always use HTTPS in production. Most hosting providers offer free SSL certificates via Let's Encrypt.

### 2. Security Headers
Add security headers to your server configuration:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 3. Content Security Policy
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline';" always;
```

## Monitoring

### Error Tracking
Consider integrating error tracking services:
- Sentry
- Rollbar
- LogRocket

### Analytics
Add analytics to track usage:
- Google Analytics
- Plausible (privacy-focused)
- Matomo

## CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### Build Fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist && npm run build`

### Large Bundle Size
- The PDF.js library is large but necessary
- Consider lazy loading if not all users need PDF support
- Use code splitting (already implemented)

### Routing Issues
- Ensure server redirects all routes to index.html
- Check .htaccess or nginx configuration

## Scaling

### Horizontal Scaling
The application is stateless and can be easily scaled horizontally by adding more instances behind a load balancer.

### Database Migration (Future)
Currently uses in-memory storage. For persistent storage:
1. Add backend API (Node.js/Python)
2. Use database (PostgreSQL/MongoDB)
3. Update documentService to use API calls
4. Add authentication

## Cost Estimates

### Free Tier Options
- Netlify: Free tier available (100GB bandwidth)
- Vercel: Free tier available
- GitHub Pages: Free for public repositories
- Cloudflare Pages: Free tier available

### Paid Options
- AWS S3 + CloudFront: ~$1-5/month for small traffic
- Azure Static Web Apps: ~$9/month
- DigitalOcean: ~$5/month for basic droplet

## Maintenance

### Regular Updates
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Rebuild
npm run build
```

### Security Updates
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Support

For deployment issues:
1. Check browser console for errors
2. Verify all files are uploaded
3. Check server logs
4. Ensure HTTPS is properly configured
5. Test with different browsers

## Next Steps

After deployment:
1. Test all features in production
2. Monitor performance and errors
3. Gather user feedback
4. Plan mobile app deployment
5. Consider backend integration for persistence
