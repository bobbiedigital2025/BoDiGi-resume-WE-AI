# Quick Start Guide - BoDiGi Resume App

## Getting the App Running Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Servers

**Option A: Run both servers (Recommended)**

Terminal 1 - Backend API:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
npx vite --port 5173
```

**Option B: Use a process manager**

You can also use tools like `concurrently` or `pm2` to run both servers:

```bash
npm install -g concurrently
```

Then add to package.json:
```json
"dev:all": "concurrently \"npm run dev\" \"npx vite --port 5173\""
```

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## What Works Out of the Box?

The app runs in **demo mode** without any database configuration:

✅ **Odds Calculator** - Fully functional
✅ **Video Portfolio** - UI works (uploading requires database)
✅ **User Management** - Shows mock data
✅ **Admin Panel** - UI accessible (functionality requires database)
✅ **API Health Check** - Always works

## Adding Database Support (Optional)

If you want full functionality with data persistence:

### Option 1: Neon Database (Recommended - Serverless PostgreSQL)

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Create `.env` file:

```bash
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### Option 2: Local PostgreSQL

```bash
# Install PostgreSQL locally
# Then create .env file:
DATABASE_URL=postgresql://localhost:5432/bodigi_iwork
```

### Option 3: Supabase

1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Add to `.env`:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### After Adding Database

Run database migrations:

```bash
npm run db:push
```

Restart the dev server:

```bash
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values as needed:

```bash
cp .env.example .env
```

### Required for Full Features:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Backend server port (default: 3001)

### Optional Services:
- `GEMINI_API_KEY` - For AI-powered features
- `OPENAI_API_KEY` - Alternative AI provider
- `STRIPE_SECRET_KEY` - For payment processing
- `SENDGRID_API_KEY` - For email notifications

## Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

The build outputs to:
- Frontend: `dist/`
- Backend: `dist/server/server.js`

## Common Issues

### Port Already in Use

If port 3001 or 5173 is in use:

```bash
# Find process using port
lsof -ti:3001
lsof -ti:5173

# Kill process
kill -9 <PID>
```

Or change the port in `.env`:

```bash
PORT=3002
```

### Dependencies Issues

If you see module not found errors:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Errors

Don't worry! The app works without a database:
- It will show a warning in console
- Mock data is used for development
- All UI features remain accessible

## Project Structure

```
├── src/                    # Frontend React code
│   ├── main.tsx           # App entry point
│   ├── components/        # Reusable components
│   ├── features/          # Feature modules
│   └── pages/             # Page components
├── server/                # Backend Express code
│   ├── server.ts          # Server entry point
│   ├── routes/            # API routes
│   └── db/                # Database connection
├── netlify/               # Netlify serverless functions
├── dist/                  # Build output
└── public/                # Static assets
```

## Testing

The app should work immediately after:

1. `npm install` ✓
2. `npm run dev` ✓  
3. `npx vite --port 5173` ✓

Navigate to http://localhost:5173 and you should see the BoDiGi IWork interface!

## Need Help?

- Check console logs for errors
- Verify both servers are running
- Try clearing browser cache
- Check `.env` file if using database features

## Next Steps

1. **For Development**: App works out of the box with mock data
2. **For Production**: Set up database and configure environment variables
3. **For Deployment**: See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for deployment guide
