# 🔧 Fix 404 Error on Page Reload - Deployment Guide

## 🚨 Problem

When deploying a React SPA (Single Page Application) with client-side routing (React Router), refreshing the page or directly accessing a URL like `/members` or `/about` results in a **404 Not Found** error.

**Why does this happen?**
- The server doesn't know about client-side routes (`/members`, `/about`, etc.)
- When you refresh `/members`, the server looks for a file called `members` and doesn't find it
- React Router handles routing on the client side, but the server needs to serve `index.html` for all routes

---

## ✅ Solution

Configure your deployment server to redirect all requests to `index.html` so React Router can handle the routing.

---

## 📋 Platform-Specific Solutions

### **1. Vercel** ⚡

**File:** `vercel.json` (already created in project root)

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Steps:**
1. ✅ File already exists in your project
2. Commit and push to GitHub
3. Vercel will automatically detect and apply the configuration
4. Redeploy your site

**Deploy to Vercel:**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

---

### **2. Netlify** 🌐

**File:** `netlify.toml` (already created in project root)

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Alternative:** `public/_redirects` (also created)

```
/*    /index.html   200
```

**Steps:**
1. ✅ Files already exist in your project
2. Commit and push to GitHub
3. Netlify will automatically detect and apply the configuration
4. Redeploy your site

**Deploy to Netlify:**
```bash
# Install Netlify CLI (if not already installed)
npm i -g netlify-cli

# Deploy
netlify deploy

# Or deploy to production
netlify deploy --prod
```

---

### **3. GitHub Pages** 📄

**File:** `public/404.html` (needs to be created)

For GitHub Pages, you need a special workaround because it doesn't support server-side redirects.

**Steps:**

1. Create `public/404.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>AutoArchitects ATV Club</title>
    <script type="text/javascript">
      // GitHub Pages SPA redirect
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
```

2. Add this script to `index.html` (in the `<head>` section):
```html
<script type="text/javascript">
  // GitHub Pages SPA redirect
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

3. Update `vite.config.ts` to set the base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/', // Replace with your GitHub repo name
  // ... rest of config
});
```

---

### **4. Apache Server** 🔴

**File:** `public/.htaccess` (already created)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**Steps:**
1. ✅ File already exists in `public/.htaccess`
2. Build your project: `npm run build`
3. Upload the `dist` folder contents to your Apache server
4. Ensure `mod_rewrite` is enabled on your Apache server

**Enable mod_rewrite (if needed):**
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

---

### **5. Nginx Server** 🟢

**File:** `nginx.conf` (already created as reference)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

**Steps:**
1. Build your project: `npm run build`
2. Upload the `dist` folder contents to your Nginx server
3. Update your Nginx configuration file (usually `/etc/nginx/sites-available/default`)
4. Add the `try_files $uri $uri/ /index.html;` line to the `location /` block
5. Reload Nginx: `sudo systemctl reload nginx`

---

## 🚀 Quick Deployment Steps

### **Step 1: Build Your Project**
```bash
npm run build
```

This creates a `dist` folder with your production-ready files.

### **Step 2: Choose Your Platform**

#### **Option A: Vercel (Recommended)**
```bash
npm i -g vercel
vercel --prod
```

#### **Option B: Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### **Option C: Manual Upload**
1. Upload the contents of the `dist` folder to your server
2. Ensure the appropriate configuration file is in place (`.htaccess` for Apache, Nginx config for Nginx)

---

## ✅ Testing the Fix

After deploying with the appropriate configuration:

1. **Navigate to your deployed site** (e.g., `https://yoursite.com`)
2. **Click on "Members"** in the navigation
3. **Refresh the page (F5 or Ctrl+R)**
4. ✅ The page should reload correctly without a 404 error
5. **Test direct URL access:** Type `https://yoursite.com/members` directly in the browser
6. ✅ The Members page should load correctly

**Test all routes:**
- `https://yoursite.com/` ✅
- `https://yoursite.com/about` ✅
- `https://yoursite.com/members` ✅
- `https://yoursite.com/login` ✅

---

## 📁 Files Created

| File | Purpose | Platform |
|------|---------|----------|
| `vercel.json` | Vercel configuration | Vercel |
| `netlify.toml` | Netlify configuration | Netlify |
| `public/_redirects` | Alternative Netlify config | Netlify |
| `public/.htaccess` | Apache server config | Apache |
| `nginx.conf` | Nginx server config (reference) | Nginx |

---

## 🔍 Troubleshooting

### **Still getting 404 errors?**

1. **Check if the config file is in the right location:**
   - Vercel: `vercel.json` in project root ✅
   - Netlify: `netlify.toml` in project root OR `_redirects` in `public/` ✅
   - Apache: `.htaccess` in `public/` (will be in `dist/` after build) ✅

2. **Verify the build output:**
   ```bash
   npm run build
   ls dist/  # Should contain index.html and your config files
   ```

3. **Check server logs:**
   - Look for any errors related to rewrite rules or redirects

4. **Clear cache:**
   - Clear your browser cache
   - Clear CDN cache (if using one)

5. **Verify deployment:**
   - Make sure you deployed the latest build
   - Check that the config file was included in the deployment

---

## 📚 Additional Resources

- [Vercel Rewrites Documentation](https://vercel.com/docs/configuration#project/rewrites)
- [Netlify Redirects Documentation](https://docs.netlify.com/routing/redirects/)
- [React Router Deployment Guide](https://reactrouter.com/en/main/guides/deployment)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 🎯 Summary

**Problem:** 404 errors on page reload for client-side routes  
**Cause:** Server doesn't know about React Router routes  
**Solution:** Configure server to redirect all requests to `index.html`  
**Status:** ✅ Configuration files created for all major platforms

**Next Steps:**
1. Identify your deployment platform
2. Commit and push the appropriate config file
3. Redeploy your site
4. Test the fix

---

**🎉 Your SPA routing should now work correctly on all routes!**

*Last Updated: 2025-11-11*

