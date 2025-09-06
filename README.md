# BoDiGi IWork - Professional Video Creation & Odds Analysis Platform

🚀 **A comprehensive platform for video content creation, professional editing, and odds analysis built with modern web technologies**

BoDiGi IWork is a full-featured application that combines professional video editing capabilities with intelligent odds calculation tools, designed for content creators, analysts, and professionals who need powerful media tools.

## 🎯 Core Features

### 🎬 Professional Video Editor
- **Multi-track Timeline**: Professional video editing with multiple tracks
- **Advanced Effects**: 15+ video effects (blur, brightness, contrast, transitions)
- **Text Overlays**: Custom text with fonts, colors, and timing
- **Audio Mixing**: Professional audio controls with effects
- **Export System**: Multiple formats and quality settings
- **Real-time Preview**: Live video preview with effects

### 📊 Odds Calculator
- **Intelligent Analysis**: AI-powered odds calculation
- **Probability Engine**: Advanced probability algorithms
- **Real-time Updates**: Live odds computation
- **Historical Tracking**: Usage analytics and trends

### 👥 User Management
- **Secure Authentication**: Multiple auth providers
- **Role-based Access**: Admin and user permissions
- **Profile Management**: User profiles and preferences
- **Subscription System**: Tiered access control

### 🎛️ Admin Dashboard
- **User Analytics**: Comprehensive user metrics
- **Content Management**: Video and odds data oversight
- **System Monitoring**: Performance and usage tracking
- **Research Tools**: Advanced analysis capabilities

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Tailwind CSS** with shadcn/ui components
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **Wouter** for client-side routing
- **TanStack Query** for state management

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** with Drizzle ORM
- **JWT Authentication** with Passport.js
- **Multer** for file uploads
- **FFmpeg** for video processing
- **Sharp** for image processing

### AI & Processing
- **Google Gemini AI** for intelligent analysis
- **OpenAI Integration** for advanced features
- **Jimp** for image manipulation
- **FFmpeg-static** for video processing

### Integrations
- **Stripe** for payments and subscriptions
- **SendGrid** for email notifications
- **Slack** for team communication
- **Google APIs** for enhanced functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- FFmpeg (for video processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bobbiedigital2025/BoDiGi-resume-WE-AI.git
   cd BoDiGi-resume-WE-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure database**
   ```bash
   npm run db:push
   ```

5. **Start development servers**
   ```bash
   # Backend server
   npm run dev

   # Frontend (in another terminal)
   npx vite --port 5173
   ```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bodigi_iwork

# Authentication
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# AI Services
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key

# External Services
SLACK_BOT_TOKEN=your_slack_bot_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🏗 Architecture Overview

### Application Structure
```
/src                    # Frontend React application
  /components/          # Reusable UI components
    /ui/               # shadcn/ui components
    /AdvancedEffects.tsx    # Video effects panel
    /AudioMixer.tsx         # Audio mixing controls
    /VideoEditor.tsx        # Basic video editor
    /FullVideoEditor.tsx    # Professional video editor
  /features/           # Feature-specific components
    /odds/             # Odds calculator components
    /admin/            # Admin dashboard components
  /pages/              # Page components
  /lib/                # Utilities and helpers

/server                 # Backend Express application
  /routes/             # API route handlers
    /users.ts          # User management APIs
    /videos.ts         # Video processing APIs
    /odds.ts           # Odds calculation APIs
  /db/                 # Database configuration
  /index.ts            # Main server entry point

/shared                 # Shared types and schemas
  /schema.ts           # Database schemas and types

/public                 # Static assets
```

### API Endpoints

#### User Management
```
GET    /api/users           # List users
POST   /api/users           # Create user
PUT    /api/users/:id       # Update user
DELETE /api/users/:id       # Delete user
```

#### Video Processing
```
GET    /api/videos          # List videos
POST   /api/videos          # Upload video
PUT    /api/videos/:id      # Update video
DELETE /api/videos/:id      # Delete video
POST   /api/videos/generate # Generate video from frames
```

#### Odds Calculator
```
GET    /api/odds            # Get odds data
POST   /api/odds/calculate  # Calculate odds
GET    /api/odds/history    # Get calculation history
```

#### Admin
```
GET    /api/admin/users     # Admin user management
GET    /api/admin/analytics # System analytics
POST   /api/admin/research  # Research operations
```

## 🎬 Video Editor Features

### Professional Editing Tools
- **Timeline Editor**: Multi-track video editing with drag-and-drop
- **Effects Library**: 15+ professional video effects
- **Text Overlays**: Custom text with advanced styling options
- **Audio Mixing**: Professional audio controls and effects
- **Export Options**: Multiple formats (MP4, WebM, MOV)

### Advanced Features
- **Keyframe Animation**: Smooth transitions and effects
- **Color Correction**: Professional color grading tools
- **Speed Control**: Variable speed playback and editing
- **Split & Trim**: Precise video editing controls
- **Layer Management**: Organize video elements in layers

## 📊 Odds Calculator Features

### Intelligent Analysis
- **Probability Engine**: Advanced statistical calculations
- **Real-time Updates**: Live odds computation and updates
- **Historical Data**: Track and analyze past calculations
- **Export Reports**: Generate detailed analysis reports

### Advanced Analytics
- **Trend Analysis**: Identify patterns and trends
- **Risk Assessment**: Calculate risk factors and probabilities
- **Comparative Analysis**: Compare multiple scenarios
- **Data Visualization**: Charts and graphs for insights

## 👥 User Management

### Authentication System
- **Multiple Providers**: Email, Google, and custom authentication
- **Role-based Access**: Admin, editor, and user roles
- **Secure Sessions**: JWT-based session management
- **Password Security**: bcrypt hashing and validation

### Subscription Management
- **Tiered Plans**: Free, Basic, and Pro plans
- **Stripe Integration**: Secure payment processing
- **Usage Tracking**: Monitor feature usage and limits
- **Auto-renewal**: Automatic subscription management

## 🎛️ Admin Dashboard

### Analytics & Monitoring
- **User Metrics**: Track user engagement and activity
- **System Performance**: Monitor server and application health
- **Revenue Analytics**: Subscription and payment tracking
- **Content Analytics**: Video and odds data insights

### Management Tools
- **User Administration**: Manage user accounts and permissions
- **Content Moderation**: Review and moderate user content
- **System Configuration**: Configure application settings
- **Backup & Recovery**: Data backup and restoration tools

## 🚀 Deployment

### Development
```bash
npm run dev          # Start development server
npm run check        # TypeScript type checking
npm run build        # Build for production
```

### Production
```bash
npm run build        # Build frontend and backend
npm start           # Start production server
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Run Tests
```bash
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:coverage # Test coverage report
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Video upload and processing
- [ ] Video editing functionality
- [ ] Odds calculation accuracy
- [ ] Admin dashboard access
- [ ] Export functionality
- [ ] Mobile responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: [GitHub Issues](https://github.com/bobbiedigital2025/BoDiGi-resume-WE-AI/issues)
- **Email**: support@bodigidigital.com

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Vercel** for hosting and deployment platform
- **shadcn/ui** for beautiful UI components
- **Open Source Community** for incredible tools and libraries

---

**BoDiGi IWork** - Professional video creation and odds analysis platform built with modern web technologies.

Built with ❤️ by Bobbie Digital

## 3. Best Practices: Frontend & Backend Separation

### Recommended Structure

- **Frontend**
   - Handles UI/UX, user interactions, and API calls.
   - Technologies: React, TypeScript, TailwindCSS.
   - Example folder: `src/`

- **Backend**
   - Handles business logic, authentication, database, payments, and APIs.
   - Technologies: Node.js/Express, Azure Functions.
   - Example folder: `server/`

- **API Layer**
   - Communicate via REST or GraphQL APIs.
   - Example: `server/routes/`

### Benefits
- Easier scaling
- Better security
- Independent development/deployment
- Maintainability

---


## 4. Monetization Best Practices

- **User Authentication:**
   - Azure AD B2C (paid, enterprise)
   - **Free/Alternative:** Auth0 (free tier), Firebase Auth (free tier), Clerk (free tier), Supabase Auth (open source)
- **Subscription Plans:** Offer free and premium tiers (monthly/yearly billing).
- **Payment Integration:**
   - Stripe, PayPal, Walli
   - **Free/Alternative:** LemonSqueezy (low fees), Paddle (low fees), Gumroad (free tier)
- **Digital Wallet:** Allow users to deposit, withdraw, and manage funds.
- **Feature Gating:** Restrict premium features to paid users (video creation, advanced analytics, etc.).
- **Ads (Optional):** Integrate non-intrusive ads for free users.
- **Analytics:**
   - Azure Monitor, Application Insights
   - **Free/Alternative:** Google Analytics (free), Plausible (open source), Umami (open source)
- **Compliance:** Ensure PCI DSS compliance for payments and GDPR for user data.

---

## 6. Free & Alternative Platform Options

- **Hosting:**
   - Azure App Service (paid)
   - **Free/Alternative:** Vercel (free tier), Netlify (free tier), Render (free tier), GitHub Pages (static sites)
- **Database:**
   - Azure SQL, Cosmos DB (paid)
   - **Free/Alternative:** Supabase (Postgres, free tier), Firebase (free tier), MongoDB Atlas (free tier), PlanetScale (free tier)
- **Storage:**
   - Azure Blob Storage (paid)
   - **Free/Alternative:** Cloudinary (free tier), Firebase Storage (free tier), GitHub Releases (small files)
- **CI/CD:**
   - Azure DevOps (paid)
   - **Free/Alternative:** GitHub Actions (free tier), GitLab CI (free tier), CircleCI (free tier)
- **Kubernetes/Containers:**
   - Azure Kubernetes Service (paid)
   - **Free/Alternative:** Docker Compose (local), Railway (free tier), Render (free tier), Fly.io (free tier)

---

## 7. Multi-Platform Deployment Example

You can deploy your app on multiple platforms for cost savings and redundancy:

- **Frontend:** Vercel, Netlify, or GitHub Pages
- **Backend/API:** Render, Railway, or Supabase Functions
- **Database:** Supabase, Firebase, or MongoDB Atlas
- **Auth:** Firebase Auth, Supabase Auth, or Auth0
- **Payments:** Stripe, LemonSqueezy, or Gumroad
- **CI/CD:** GitHub Actions or GitLab CI

---

For more details or setup guides for any free platform, request the specific section you need.

---

## 5. Recommended Folder Structure

```
/src           # Frontend (React, UI, pages, features)
/server        # Backend (APIs, business logic)
   /routes      # API endpoints
   /db          # Database connection and models
/shared        # Shared types, schema
/public        # Static assets
README.md      # Documentation
```

---

## Additional Tips
- Use environment variables and Azure Key Vault for secrets.
- Automate deployments with CI/CD.
- Monitor usage and errors with Azure Monitor.
- Document APIs and user flows.

---

For implementation guides or code samples, request the specific section you need.
# Famous Resume - MCP-Powered AI Resume Builder

🚀 **Revolutionary AI-powered resume optimization with zero API costs and maximum privacy**

Famous Resume transforms the way professionals create resumes by leveraging MCP (Model Context Protocol) A2A technology for local AI processing, eliminating expensive API subscriptions while providing enterprise-grade resume optimization.

## 🎯 Key Features

### 🤖 MCP A2A AI Technology
- **Zero API Costs**: Local AI processing eliminates external service dependencies
- **Maximum Privacy**: Your data never leaves your system
- **Always Available**: Works without internet connectivity
- **Intelligent Fallback**: Gemini API → MCP local processing

### 📄 Professional Resume Building
- **ATS-Optimized Templates**: Pass applicant tracking systems automatically
- **Smart Keyword Analysis**: AI-powered job description parsing
- **Multi-Format Export**: PDF, DOCX, TXT, and JSON formats
- **Real-time Optimization**: Live ATS compatibility scoring

### 🔄 Intelligent Workflow System
- **Guided Experience**: Step-by-step resume creation process
- **AI-Powered Stages**: Keywords → ATS Check → Cover Letter → Interview Prep
- **Auto-save Checkpoints**: Never lose your progress
- **Professional Templates**: Industry-specific resume designs

### 📊 Advanced Analytics (Admin)
- **User Growth Tracking**: Monitor platform adoption
- **Conversion Analytics**: Track free-to-paid conversions
- **Revenue Metrics**: MRR, ARR, and churn analysis
- **MCP Adoption**: Monitor A2A integration success

## 💰 Pricing Plans

### 🆓 Free Trial - 3 Days
- **Full feature access** for 3 days
- All resume templates and formats
- AI-powered optimization and analysis
- PDF & DOCX export capabilities
- Basic video portfolio access
- Single profile with job-specific sub-folders

### Basic - $4.99/month
- All trial features included
- Advanced ATS optimization with full AI agent scanner
- Application Tracking System (ATS) support
- Google Sheets integration for job application tracking
- Update status tracking (applied, interview, follow-up, hired/rejected)
- Organized progress data management

### Pro - $9.99/month ⭐ Most Popular
- All Basic features included
- **Video Portfolio Studio** (Desktop only)
- AI-powered video resume creation with professional templates
- Advanced video editing tools and multiple download formats
- Enhanced ATS optimization with full scanner pass
- AI email generation for follow-up messages
- Auto-generate interview preparation materials
- Gmail integration for sending drafts (MCP A2A)
- Check-in automations for status updates and thank you messages

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express and TypeScript
- **Drizzle ORM** with PostgreSQL
- **Replit Auth** via OIDC integration
- **Express Sessions** with PostgreSQL storage

### AI & Processing
- **MCP A2A Technology** for local AI processing
- **Google Gemini API** (optional fallback)
- **Local Keyword Analysis** without external APIs
- **Smart Content Generation** using pattern recognition

### Integrations
- **Google Drive** via MCP for file management
- **Google Sheets** for application tracking
- **Gmail** for email automation
- **Canva** for design integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Optional: Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/famous-resume.git
   cd famous-resume
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Configure database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/famous_resume

# Authentication
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_client_secret

# AI Services (Optional)
GEMINI_API_KEY=your_gemini_api_key

# MCP Configuration
MCP_AUTH_BASE=https://mcp.auth.provider
MCP_CLIENT_ID=your_mcp_client_id
MCP_REDIRECT_URI=http://localhost:5000/auth/mcp/callback
```

## 🏗 Architecture

### MCP A2A Integration
Famous Resume pioneered the use of MCP (Model Context Protocol) A2A technology to replace expensive AI API subscriptions with local processing:

- **Job Description Analysis**: Pattern-based keyword extraction
- **ATS Scoring**: Local compatibility checking algorithms
- **Content Generation**: Template-based professional writing
- **Cover Letter Creation**: Intelligent personalization without APIs

### Data Privacy
- **Local Processing**: All AI operations happen on your server
- **No Data Transmission**: Sensitive information never leaves your system
- **GDPR Compliant**: Complete data sovereignty
- **Zero Tracking**: No external analytics or monitoring

### Scalability
- **Serverless Ready**: Deploy on any Node.js hosting platform
- **Database Agnostic**: PostgreSQL with easy migration options
- **CDN Optimized**: Static assets served efficiently
- **Auto-scaling**: Handles traffic spikes gracefully

## 📱 API Documentation

### Authentication Endpoints
```
POST /api/auth/login - User login
GET  /api/auth/me - Get current user
POST /api/auth/logout - User logout
```

### Resume Management
```
GET    /api/profiles - List user profiles
POST   /api/profiles - Create new profile
PUT    /api/profiles/:id - Update profile
DELETE /api/profiles/:id - Delete profile
```

### AI-Powered Optimization
```
POST /api/ai/optimize-resume - MCP-powered resume optimization
POST /api/ai/analyze-job-match - Job compatibility analysis
POST /api/ai/resume-suggestions - Industry-specific recommendations
POST /api/ai/interview-prep - Generate interview preparation
```

### Workflow Management
```
POST /api/workflow/start - Start new workflow session
POST /api/workflow/checkpoint - Save workflow progress
GET  /api/workflow/state/:profileId - Get workflow state
POST /api/workflow/export - Export completed resume
```

## 🧪 Testing

### Run Test Suite
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Manual Testing
1. Create a test profile
2. Start the workflow process
3. Test AI optimization features
4. Verify export functionality
5. Check MCP integrations

## 🚀 Deployment

### Replit Deployment
```bash
# Deploy to Replit
npm run deploy:replit
```

### Production Environment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup
- Configure production database
- Set up domain and SSL
- Configure MCP endpoints
- Enable monitoring and logging

## 🤝 Contributing

We welcome contributions to Famous Resume! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Standards
- TypeScript strict mode
- ESLint with Prettier formatting
- Comprehensive test coverage
- Documentation for new features

## 📄 License

This project is licensed under a **Personal Profit Use License** - see the [LICENSE.md](LICENSE.md) file for complete terms.

⚠️ **IMPORTANT**: This software is NOT for sale and requires proper licensing for commercial use.

### Quick License Summary:
- ✅ **Personal Use**: Free with subscription
- ✅ **Commercial Use**: Requires paid license ($199-$999)
- ❌ **Resale**: Strictly prohibited
- ❌ **Redistribution**: Not permitted without license

**Commercial licensing available**: licensing@bodigidigital.com

## 🆘 Support

- **Documentation**: [docs.famousresume.com](https://docs.famousresume.com)
- **Email Support**: support@famousresume.com
- **Community**: [Discord Server](https://discord.gg/famousresume)
- **Issues**: [GitHub Issues](https://github.com/your-username/famous-resume/issues)

## 🙏 Acknowledgments

- **MCP Technology**: Pioneering local AI processing
- **Replit Team**: Excellent hosting and authentication platform
- **Open Source Community**: Amazing libraries and tools
- **Beta Users**: Valuable feedback and testing

---

**Famous Resume** - Revolutionizing professional resume creation with privacy-first AI technology.

Built with ❤️ using MCP A2A Technology