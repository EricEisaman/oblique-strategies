# Render.com Deployment Guide

This guide outlines the specific steps to deploy the Oblique Strategies application to Render.com using Docker.

## Prerequisites

- A Render.com account
- Your GitHub repository connected to Render
- Docker knowledge (basic understanding)

## Step 1: Prepare Your Repository

### 1.1 Verify Repository Structure
Ensure your repository has the following key files:
```
oblique-strategies/
├── Dockerfile              # Docker configuration
├── render.yaml             # Render deployment config
├── package.json           # Root dependencies
├── client/
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
└── server/
    └── index.ts           # Express server
```

### 1.2 Verify Dockerfile
Your `Dockerfile` should look like this:
```dockerfile
# Use Node.js 24 for better compatibility
FROM node:24

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Create dist directory
RUN mkdir -p dist/server

# Build the application (unified build process)
RUN npm run build

# Ensure proper file permissions for static assets (after build)
RUN chmod -R 755 client/dist/ && \
    if [ -d "client/dist/icons" ]; then \
        chmod -R 755 client/dist/icons/; \
    else \
        echo "Warning: client/dist/icons directory not found"; \
    fi

# Expose port
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Start the application
CMD ["npm", "start"]
```

### 1.3 Verify render.yaml
Your `render.yaml` should contain:
```yaml
services:
  - type: web
    name: oblique-strategies
    env: docker
    plan: starter
    dockerfilePath: ./Dockerfile
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /api/health
    autoDeploy: true
```

## Step 2: Connect Repository to Render

### 2.1 Access Render Dashboard
1. Go to [render.com](https://render.com)
2. Sign in to your account
3. Click "New +" in the top right
4. Select "Web Service"

### 2.2 Connect GitHub Repository
1. Click "Connect account" next to GitHub
2. Authorize Render to access your repositories
3. Select the `oblique-strategies` repository
4. Choose the branch (usually `master` or `main`)

## Step 3: Configure Deployment Settings

### 3.1 Basic Configuration
- **Name**: `oblique-strategies` (or your preferred name)
- **Environment**: `Docker`
- **Region**: Choose closest to your users
- **Branch**: `master` (or your main branch)
- **Root Directory**: Leave empty (root of repository)

### 3.2 Advanced Settings
- **Build Command**: Leave empty (handled by Dockerfile)
- **Start Command**: Leave empty (handled by Dockerfile)
- **Health Check Path**: `/api/health`

### 3.3 Environment Variables
Add these environment variables:
- `NODE_ENV`: `production`
- `PORT`: `10000`

## Step 4: Deploy the Application

### 4.1 Initial Deployment
1. Click "Create Web Service"
2. Render will automatically:
   - Pull your code
   - Build the Docker image
   - Deploy the container
   - Start the service

### 4.2 Monitor Deployment
1. Watch the build logs for any errors
2. Common issues to watch for:
   - Node.js version compatibility
   - Missing dependencies
   - Build failures
   - Port conflicts

## Step 5: Verify Deployment

### 5.1 Health Check
1. Wait for deployment to complete
2. Check the health endpoint: `https://your-app-name.onrender.com/api/health`
3. Should return: `{"status":"ok","timestamp":"..."}`

### 5.2 Test Application
1. Visit your app URL: `https://your-app-name.onrender.com`
2. Test the main functionality:
   - Load a random strategy
   - Check responsive design
   - Test favorites functionality

### 5.3 Check Logs
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for any errors or warnings
4. Common log entries to expect:
   ```
   Server running on port 10000
   ```

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain (e.g., `oblique-strategies.com`)
4. Configure DNS records as instructed

### 6.2 SSL Certificate
- Render automatically provides SSL certificates
- No additional configuration needed

## Step 7: Monitor and Maintain

### 7.1 Set Up Monitoring
1. **Uptime Monitoring**: Use Render's built-in health checks
2. **Log Monitoring**: Check logs regularly for errors
3. **Performance**: Monitor response times and resource usage

### 7.2 Auto-Deployment
- Your `render.yaml` has `autoDeploy: true`
- Any push to the main branch triggers automatic deployment
- Monitor deployment status in Render dashboard

## Troubleshooting Common Issues

### Issue 1: Build Failures
**Symptoms**: Build fails during Docker build
**Solutions**:
- Check Dockerfile syntax
- Verify all dependencies are in package.json
- Ensure Node.js version compatibility
- Check for missing files in repository

### Issue 2: Port Conflicts
**Symptoms**: Service won't start
**Solutions**:
- Verify PORT environment variable is set to 10000
- Check Dockerfile EXPOSE directive
- Ensure no other services use the same port

### Issue 3: Health Check Failures
**Symptoms**: Service shows as unhealthy
**Solutions**:
- Verify `/api/health` endpoint returns 200 status
- Check server is listening on correct port
- Review server logs for startup errors

### Issue 4: Static Assets Not Loading
**Symptoms**: CSS/JS files return 404
**Solutions**:
- Verify Vite build completed successfully
- Check file permissions in Dockerfile
- Ensure static file serving is configured correctly

### Issue 5: Environment Variables Missing
**Symptoms**: App behaves differently in production
**Solutions**:
- Add missing environment variables in Render dashboard
- Verify variables are being read correctly in code
- Check for hardcoded development values

## Performance Optimization

### 1. Enable Caching
- Static assets are automatically cached
- API responses can be cached based on your needs
- Consider implementing Redis for session storage

### 2. Optimize Build Process
- Use multi-stage Docker builds
- Minimize Docker image size
- Optimize npm install with package-lock.json

### 3. Monitor Resource Usage
- Start with "starter" plan
- Upgrade to "standard" if needed
- Monitor CPU and memory usage

## Security Considerations

### 1. Environment Variables
- Never commit sensitive data to repository
- Use Render's environment variable system
- Rotate secrets regularly

### 2. HTTPS
- Render provides automatic HTTPS
- No additional configuration needed
- Ensure all external links use HTTPS

### 3. CORS Configuration
- Configure CORS for your domain
- Restrict access to necessary origins
- Review security headers

## Cost Optimization

### 1. Plan Selection
- **Starter**: $7/month (good for development/testing)
- **Standard**: $25/month (better for production)
- **Pro**: $50/month (high-traffic applications)

### 2. Auto-Scaling
- Configure auto-scaling based on traffic
- Set minimum and maximum instances
- Monitor usage to optimize costs

## Maintenance Schedule

### Daily
- Check deployment status
- Review error logs
- Monitor performance metrics

### Weekly
- Review security updates
- Check dependency updates
- Analyze usage patterns

### Monthly
- Review and optimize costs
- Update dependencies
- Plan feature updates

## Support Resources

### Render Documentation
- [Render Docs](https://render.com/docs)
- [Docker on Render](https://render.com/docs/deploy-an-image)
- [Environment Variables](https://render.com/docs/environment-variables)

### Community Support
- [Render Community](https://community.render.com)
- [GitHub Issues](https://github.com/EricEisaman/oblique-strategies/issues)

### Emergency Contacts
- Render Support: Available through dashboard
- GitHub: For code-related issues
- Documentation: This guide and README.md

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Eric Eisaman
