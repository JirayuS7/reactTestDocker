# Netlify Deployment Guide

## Overview
Your React SSR app is now configured to work with Netlify deployment. The app will automatically switch between development (proxy) and production (direct API calls) modes.

## Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Netlify Configuration
Your app includes:
- **_redirects file**: Already created in `public/_redirects` for SPA routing
- **Environment Variables**: Configure in Netlify dashboard
- **API Client**: Automatically switches between dev/prod environments

### 3. Environment Variables (Set in Netlify Dashboard)
```
VITE_API_BASE_URL=https://netsoftdev.com/psei-api_new
VITE_NODE_ENV=production
```

### 4. Deploy Options

#### Option A: Drag & Drop
1. Run `npm run build`
2. Drag the `dist` folder to Netlify deploy interface

#### Option B: Git Integration
1. Push code to GitHub/GitLab
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### 5. API Configuration
- **Development**: Uses Vite proxy (`/api/*` → `https://netsoftdev.com/psei-api_new/*`)
- **Production**: Direct calls to `https://netsoftdev.com/psei-api_new`

### 6. Features Available
- ✅ Server-Side Rendering (SSR)
- ✅ Environment-aware API calls
- ✅ FullCalendar with Year/Week/Month views
- ✅ Ant Design modals for events
- ✅ CORS-free API communication
- ✅ TypeScript support

### 7. Testing Deployment
After deployment, your app will show:
- Environment Info tab with deployment status
- API Test tab for endpoint verification
- User List tab with API data
- Calendar tab with full functionality

## Notes
- No CORS issues in production (direct API calls)
- Environment info displayed in the app
- All console.log errors resolved
- SSR works for better SEO and performance
