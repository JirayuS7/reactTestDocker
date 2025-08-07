# Frontend-Backend Communication Options

## Current Setup
- **Backend**: Port 5000 (`http://localhost:5000`)
- **Frontend**: Port 5173 (`http://localhost:5173`)

## Option 1: Vite Proxy (✅ **RECOMMENDED FOR DEVELOPMENT**)

### How it works:
- Vite dev server forwards API calls from frontend to backend
- Frontend calls `/api/users` → Vite forwards to `http://localhost:5000/users`
- No CORS issues, simpler setup

### Configuration Done:
1. **vite.config.ts** - Added proxy configuration
2. **App.tsx** - Updated to use `/api/users` instead of full URL

### Usage:
```bash
npm run dev  # Start with proxy
```

### Benefits:
- ✅ Simple setup
- ✅ No CORS issues
- ✅ Works in development immediately
- ✅ Fast development workflow

### Limitations:
- ❌ Only works in development
- ❌ Need separate production configuration

---

## Option 2: SSR (Server-Side Rendering) 

### How it works:
- Server fetches data before rendering
- HTML is sent with data already included
- Client hydrates the pre-rendered content

### Files Available:
1. **src/api.ts** - Server-side data fetching
2. **src/AppSSR.tsx** - SSR-enabled component
3. **src/entry-server.tsx** - Server entry point
4. **server.ts** - Express SSR server

### Usage:
```bash
npm run dev:ssr  # Would start SSR server (needs script update)
```

### Benefits:
- ✅ SEO friendly
- ✅ Faster initial page load
- ✅ Works in production
- ✅ Better user experience

### Limitations:
- ❌ More complex setup
- ❌ Requires backend to be available during build
- ❌ More difficult to debug

---

## Recommendation

### For Development:
**Use Option 1 (Vite Proxy)** - It's already configured and ready to use!

### For Production:
You have several options:
1. **Reverse Proxy** (nginx, Apache)
2. **API Gateway** 
3. **SSR** (if you need SEO)
4. **Environment-based URLs**

---

## Quick Start

### Option 1 (Proxy - Ready to use):
```bash
npm run dev
# Your app will run on http://localhost:5173
# API calls to /api/* will be forwarded to http://localhost:5000
```

### Option 2 (SSR - If you want to try):
1. Update package.json scripts to include SSR
2. Modify App.tsx to use AppSSR.tsx
3. Start SSR server

---

## Testing

1. **Start your backend server on port 5000**
2. **Start frontend with proxy**: `npm run dev`
3. **Open**: `http://localhost:5173`
4. **Check Network tab** - you should see API calls to `/api/users`

The proxy approach is working and ready for your development needs!
