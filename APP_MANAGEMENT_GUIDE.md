# Famous Resume App - Post-Deployment Management Guide

## Table of Contents
1. [Legal Compliance & Privacy](#legal-compliance--privacy)
2. [Security Management](#security-management)
3. [Database Management](#database-management)
4. [Performance Monitoring](#performance-monitoring)
5. [Content Management](#content-management)
6. [User Management](#user-management)
7. [Analytics & Insights](#analytics--insights)
8. [Maintenance & Updates](#maintenance--updates)
9. [Backup & Recovery](#backup--recovery)
10. [Troubleshooting](#troubleshooting)

---

## Legal Compliance & Privacy

### Cookie Consent Management
✅ **Your app now includes:**
- EU GDPR-compliant cookie consent banner
- Granular cookie preferences (Necessary, Analytics, Marketing, Functional)
- Automatic Google Analytics/AdSense consent integration
- User preference persistence

**Management Tasks:**
- Monitor cookie consent acceptance rates in `/admin` dashboard
- Update cookie policies when adding new tracking tools
- Review consent logs quarterly for compliance audits

### Privacy Policy Updates Required
🔄 **When to update:**
- Adding new third-party integrations
- Changing data processing practices  
- New marketing tools or analytics
- Legal requirement changes in your jurisdiction

**File to update:** `client/src/pages/privacy-policy.tsx`

### Required Environment Variables for Compliance
```bash
# Google Services (for consent management)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Analytics (if enabled by user consent)
GA_MEASUREMENT_ID=your-ga-id

# AdSense (if enabled by user consent)
ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx
```

---

## Security Management

### HTTP Security Headers
Your app includes these security measures:
- **Session cookies:** `httpOnly: true, secure: true` (7-day expiry)
- **CSRF protection:** Built-in with sessions
- **Data encryption:** PostgreSQL with encrypted backups

**Recommended additions:**
```javascript
// Add to server/index.ts
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
```

### User Data Protection
- **Password hashing:** bcrypt with 12 rounds
- **JWT tokens:** 7-day expiry with secure signing
- **Database:** All personal data encrypted at rest
- **File uploads:** Validated and sanitized

---

## Database Management

### Daily Monitoring
Your app automatically exports customer data daily at 9 AM EST to:
- Google Sheets (if `CUSTOMER_DATA_SPREADSHEET_ID` is set)
- Email CSV to `bodigidigital@gmail.com`

### Database Maintenance Commands
```bash
# Push schema changes
npm run db:push

# Force push (if data loss warning)
npm run db:push --force

# View current data
# Use execute_sql_tool in your Replit environment
```

### Key Tables to Monitor
- `users` - User accounts and subscriptions
- `profiles` - Resume profiles and data
- `sessions` - Active user sessions (auto-cleanup)
- `resume_exports` - Export history and analytics

---

## Performance Monitoring

### Cache Strategy
✅ **Current caching:**
- **Frontend:** React Query with `staleTime: Infinity`
- **Static assets:** Browser caching via Vite
- **Database:** Connection pooling with Neon PostgreSQL

### Performance Metrics to Track
1. **Page load times** (target: <2 seconds)
2. **API response times** (target: <500ms)
3. **Database query performance**
4. **Resume export generation time**

### Optimization Checklist
- [ ] Enable production build caching
- [ ] Optimize images and assets
- [ ] Monitor database connection pool
- [ ] Set up CDN for static assets (optional)

---

## Content Management

### Resume Templates
**Location:** `client/src/components/resume-templates/`
**Updates:** Templates are stored in components, modify directly

### Blog & Career Content
**Location:** 
- `client/src/pages/career-advice.tsx`
- `client/src/pages/job-search-blog.tsx`  
- `client/src/pages/cover-letter-tips.tsx`

**Management:** Edit React components directly or migrate to a CMS

### Legal Pages Updates
- **Privacy Policy:** `client/src/pages/privacy-policy.tsx`
- **Terms of Service:** `client/src/pages/terms.tsx`
- **Help Center:** `client/src/pages/help-center.tsx`

---

## User Management

### Subscription Management
**Plans available:**
- `free` - Basic features
- `basic` - $2.99/month via Stripe
- `pro` - $4.99/month via Stripe  
- `mcp_free` - Premium via Google OAuth connection

### User Support Tasks
1. **Account issues:** Use admin dashboard at `/admin`
2. **Subscription problems:** Check Stripe dashboard
3. **Data export requests:** Use customer data export service
4. **Account deletion:** Database cleanup required

### Admin Dashboard Access
**Route:** `/admin`
**Requires:** Admin user role (set in database)

---

## Analytics & Insights

### Built-in Analytics
✅ **Your app tracks:**
- User registrations and conversions
- Resume creation and export events
- Feature usage patterns
- Subscription metrics

### Google Analytics Setup
1. Set `GA_MEASUREMENT_ID` environment variable
2. Analytics only tracks users who consent to cookies
3. Data retention: 14 months (standard GA setting)

### Business Metrics to Monitor
- Monthly Active Users (MAU)
- Conversion rate (trial → paid)
- Resume export volume
- Customer lifetime value (CLV)

---

## Maintenance & Updates

### Weekly Tasks
- [ ] Review error logs in Replit console
- [ ] Check database performance metrics
- [ ] Monitor subscription churn rates
- [ ] Update content and career advice

### Monthly Tasks  
- [ ] Security audit of dependencies (`npm audit`)
- [ ] Review privacy policy compliance
- [ ] Analyze user feedback and support tickets
- [ ] Update resume templates based on trends

### Quarterly Tasks
- [ ] Full security review
- [ ] Legal compliance audit
- [ ] Performance optimization review
- [ ] User experience analysis

---

## Backup & Recovery

### Automatic Backups
✅ **PostgreSQL backups:** Handled by Neon (your database provider)
- Point-in-time recovery available
- Geographic replication included

### Manual Backup Options
```javascript
// Export all user data (run in Replit console)
const { storage } = require('./server/storage');
async function exportAllData() {
  const users = await storage.getAllUsers();
  const profiles = await storage.getAllProfiles();
  // Export to JSON files
}
```

### Recovery Procedures
1. **Database restore:** Use Neon dashboard
2. **Application rollback:** Use Replit's rollback feature
3. **User data recovery:** Contact support with specific user ID

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Cookie Consent Not Showing
**Symptoms:** Banner doesn't appear for new users
**Solution:** Check localStorage and clear browser data
```javascript
// Reset consent for testing
localStorage.removeItem('cookie-consent');
```

#### 2. Google Services Integration Failing
**Symptoms:** OAuth or API errors
**Check:** 
- Environment variables are set correctly
- Google Console API limits
- Service account permissions

#### 3. Database Connection Issues
**Symptoms:** API timeouts or connection errors
**Solution:**
- Check `DATABASE_URL` environment variable
- Verify Neon database status
- Restart application

#### 4. Stripe Payment Failures
**Symptoms:** Subscription creation fails
**Check:**
- Stripe webhook endpoints
- API key validity
- Customer email verification

### Support Contacts
- **Technical issues:** Use Replit support
- **Legal questions:** Consult your legal counsel
- **Payment issues:** Stripe support dashboard
- **Database issues:** Neon support

---

## Emergency Procedures

### Data Breach Response
1. **Immediate:** Disable affected user accounts
2. **Within 24h:** Assess scope and notify legal team
3. **Within 72h:** GDPR breach notification (if EU users affected)
4. **Follow-up:** User communication and system updates

### Application Downtime
1. Check Replit status page
2. Review recent deployments
3. Check database connectivity
4. Enable maintenance mode if needed

### Security Incident
1. Rotate all API keys and secrets
2. Force logout all users (clear sessions table)
3. Review access logs
4. Update security measures

---

## Contact Information

**Legal Issues:**
- Email: legal@famousresume.com
- Privacy: privacy@famousresume.com

**Technical Support:**
- Use Replit support for hosting issues
- GitHub issues for code problems

**Business Operations:**
- Analytics: bodigidigital@gmail.com
- Customer data exports sent daily

---

*Last updated: January 2025*
*Review and update this guide quarterly or after major changes.*