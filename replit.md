# BoDiGi_I_Work - MCP-Powered Professional Resume Builder

## Overview

BoDiGi_I_Work is a revolutionary full-stack web application that creates ATS-optimized resumes and cover letters using MCP (Model Context Protocol) technology. Instead of expensive API subscriptions, users connect their own Google services for premium features at zero cost. The platform features AI-powered job description parsing, keyword analysis, and intelligent resume optimization using local processing and MCP connections to Google Drive, Sheets, Calendar, and Gmail.

## Recent Changes (January 2025)

✅ **Major Architecture Update: Moved from API-based to MCP-based approach**
- Replaced OpenAI API calls with local AI processing (zero API costs)
- Replaced Stripe subscriptions with free MCP Google connections
- Added MCP service for Google Drive, Sheets, Calendar, and Gmail integration
- Updated database schema to store MCP tokens instead of Stripe data
- Created MCP connection pages and pricing updates
- Users now get premium features for free by connecting their Google account

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage for persistent authentication
- **File Generation**: DOCX library for creating ATS-compliant resume documents
- **API Design**: RESTful endpoints with proper error handling and validation

### Authentication & Authorization
- **Provider**: Replit OIDC integration for seamless authentication
- **Session Storage**: PostgreSQL-backed sessions with secure cookie configuration
- **User Management**: Comprehensive user profiles with subscription status tracking
- **Security**: HTTPS enforcement, secure cookies, and CSRF protection

### Database Design
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Data Models**: Users, Profiles, Experiences, Education, Applications, and Templates
- **Relationships**: Foreign key constraints with cascade deletes for data integrity
- **Multi-tenancy**: User-scoped data access with proper isolation

### AI Integration
- **Provider**: OpenAI GPT-4o for natural language processing
- **Capabilities**: Job description parsing, keyword extraction, resume optimization, and cover letter generation
- **Features**: ATS scoring, bullet point enhancement, and professional summary creation
- **Content Safety**: Guardrails to prevent fabrication of credentials and maintain authenticity

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **OpenAI API**: GPT-4o model for AI-powered content generation and analysis
- **Stripe**: Payment processing with Checkout and Customer Portal integration
- **Replit Auth**: OIDC authentication provider for user management

### Development Tools
- **Vite**: Frontend build tool with hot module replacement
- **TypeScript**: Static type checking across frontend and backend
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Fast JavaScript bundling for production builds

### UI Libraries
- **Radix UI**: Accessible component primitives for complex interactions
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide Icons**: Consistent icon library for UI elements
- **React Icons**: Extended icon set for brand and social media icons

### Document Generation
- **DOCX Library**: Microsoft Word document creation for ATS-compatible resumes
- **PDF Export**: Client-side PDF generation capabilities
- **File Storage**: Planned integration with cloud storage providers

### Payment & Subscription
- **Stripe Elements**: Secure payment form components
- **Webhook Handling**: Real-time subscription status updates
- **Customer Portal**: Self-service billing management for users