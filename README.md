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