# Netlify Deployment Guide for BoDiGi Resume

This guide will help you set up automatic deployments to Netlify for the BoDiGi Resume application.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup) (free tier works fine)
2. Your GitHub repository connected to Netlify

## Step 1: Connect Repository to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `bobbiedigital2025/BoDiGi-resume-WE-AI`
5. Configure build settings (these should auto-populate from `netlify.toml`):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize the site
netlify init

# Follow the prompts to connect your GitHub repo
```

## Step 2: Configure Environment Variables

In the Netlify dashboard, go to **Site settings** → **Environment variables** and add:

### Required for Basic Functionality
None! The app works without a database in demo mode.

### Optional - For Full Features

```bash
# Database (for production data persistence)
DATABASE_URL=postgresql://user:password@host:5432/db

# AI Services (for AI-powered features)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Authentication (for user management)
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Payment Processing (for paid features)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Service (for notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Step 3: Enable Auto-Deploy

Once connected, Netlify automatically deploys your site when you:

1. **Push to main branch** - Automatically triggers a production deploy
2. **Create a Pull Request** - Creates a preview deployment for testing
3. **Merge a PR** - Triggers a new production deploy

### Configure Deploy Settings

1. Go to **Site settings** → **Build & deploy** → **Continuous deployment**
2. Under **Branches**, set:
   - **Production branch**: `main`
   - **Branch deploys**: `All` (to get preview deploys for PRs)

## Step 4: Configure Deploy Notifications (Optional)

### Slack Notifications

1. Go to **Site settings** → **Build & deploy** → **Deploy notifications**
2. Click "Add notification"
3. Choose "Slack" and configure your webhook

### Email Notifications

1. Same location as above
2. Choose "Email" notification
3. Add your email address

## Step 5: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

## Testing Your Deployment

After deployment, test these endpoints:

- **Frontend**: `https://your-site.netlify.app`
- **Health Check**: `https://your-site.netlify.app/api/health`
- **Mock Users**: `https://your-site.netlify.app/api/users`

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Ensure `package.json` dependencies are correct
3. Verify environment variables are set if needed

### Functions Not Working

1. Check if `netlify/functions` directory exists
2. Verify `netlify.toml` has correct functions configuration
3. Check function logs in Netlify dashboard

### API Routes 404

1. Verify redirects in `netlify.toml` are correct
2. Check that API functions are deployed
3. Test function directly at `/.netlify/functions/api`

## Production Checklist

Before deploying to production with real users:

- [ ] Set up a production database (e.g., Neon, Supabase, or Railway)
- [ ] Configure `DATABASE_URL` environment variable
- [ ] Set up proper authentication secrets
- [ ] Configure custom domain
- [ ] Enable HTTPS (automatic with Netlify)
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategy for database

## Auto-Deploy Features

With this setup, you get:

✅ **Automatic deployments** on every push to main
✅ **Preview deployments** for every pull request
✅ **Rollback capability** to any previous deploy
✅ **Deploy notifications** (optional)
✅ **Branch deploys** for testing (optional)
✅ **Build cache** for faster deployments
✅ **CDN distribution** for fast global access

## Support

For issues with:
- **Application code**: Open an issue on GitHub
- **Netlify platform**: Check [Netlify Support](https://www.netlify.com/support/)
- **Database**: Check your database provider's documentation

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
