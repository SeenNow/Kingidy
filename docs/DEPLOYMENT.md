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
