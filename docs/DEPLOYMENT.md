# MonDeneigeur PWA - Deployment Guide

This guide covers the deployment process for the MonDeneigeur PWA application, including production optimization, security hardening, and monitoring setup.

## 🚀 Quick Deployment

### Prerequisites

- Node.js 18+ installed
- Git repository access
- Supabase project configured
- Environment variables ready

### Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://erbzmoqoocmptkbflibr.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Weather API
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Monitoring (Optional)
VITE_SENTRY_DSN=your_sentry_dsn
```

## 📦 Build Optimization

### Local Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Analysis

```bash
# Analyze bundle size
npm run build:analyze
```

This will generate a visual report of your bundle size and help identify optimization opportunities.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

#### Automatic Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   # Deploy to Vercel
   vercel --prod
   ```

3. **Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required environment variables

#### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Option 2: Netlify

#### Automatic Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Netlify
   - Netlify will automatically detect the build settings

2. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required environment variables

3. **Deploy**
   - Push to main branch triggers automatic deployment

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: Static Hosting

#### Build for Static Hosting

```bash
# Build the project
npm run build

# The dist/ folder contains your static files
```

Upload the contents of the `dist/` folder to your static hosting provider.

## 🔒 Security Configuration

### Security Headers

The application includes comprehensive security headers:

- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Controls browser features
- **Content-Security-Policy**: Prevents XSS and injection attacks

### Content Security Policy

The CSP is configured to allow:
- Supabase connections
- OpenWeather API calls
- Inline styles (for Tailwind)
- Data URLs for images
- Blob URLs for file uploads

## 📊 Monitoring & Analytics

### Sentry Error Tracking

1. **Setup Sentry**
   - Create a Sentry account
   - Create a new project
   - Get your DSN

2. **Configure Environment Variable**
   ```env
   VITE_SENTRY_DSN=your_sentry_dsn
   ```

3. **Features Enabled**
   - Error tracking and reporting
   - Performance monitoring
   - User session replay
   - Custom metrics

### Performance Monitoring

The application includes Web Vitals monitoring:

- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

### Custom Metrics

Track custom performance metrics:

```typescript
import { measurePerformance } from '@/lib/monitoring'

// Measure custom operations
const duration = measurePerformance('api_call', () => {
  // Your operation here
})
```

## 🔧 Production Optimization

### Bundle Optimization

The build process includes:

- **Code Splitting**: Automatic chunk splitting by feature
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser minification
- **Gzip Compression**: Automatic compression

### Caching Strategy

- **Static Assets**: 1 year cache with immutable
- **Service Worker**: No cache, always fresh
- **HTML**: No cache, always fresh
- **API Calls**: No cache

### Performance Tips

1. **Image Optimization**
   - Use WebP format when possible
   - Implement lazy loading
   - Optimize image sizes

2. **Code Splitting**
   - Routes are automatically code-split
   - Large dependencies are split into separate chunks

3. **PWA Optimization**
   - Service worker for offline support
   - App manifest for installation
   - Fast loading with optimized assets

## 🚨 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Lint code
npm run lint
```

#### Environment Variables

Ensure all required environment variables are set:

```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
echo $VITE_OPENWEATHER_API_KEY
```

#### Performance Issues

1. **Bundle Size**
   ```bash
   npm run build:analyze
   ```

2. **Web Vitals**
   - Check browser DevTools
   - Monitor Sentry performance metrics

#### Security Issues

1. **CSP Violations**
   - Check browser console for CSP errors
   - Update CSP in deployment config

2. **CORS Issues**
   - Ensure Supabase URL is correct
   - Check API endpoints

## 📈 Monitoring Dashboard

### Key Metrics to Monitor

1. **Performance**
   - Page load times
   - Core Web Vitals
   - Bundle size

2. **Errors**
   - JavaScript errors
   - API failures
   - User-reported issues

3. **Usage**
   - Active users
   - Page views
   - Feature usage

### Alerting

Set up alerts for:
- Error rate > 1%
- Performance degradation
- Service downtime

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run test:e2e
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Sentry Documentation](https://docs.sentry.io/)
- [Web Vitals](https://web.dev/vitals/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## 🆘 Support

For deployment issues:

1. Check the troubleshooting section
2. Review build logs
3. Verify environment variables
4. Contact the development team

---

**MonDeneigeur PWA** - Professional deployment guide for production-ready applications. 