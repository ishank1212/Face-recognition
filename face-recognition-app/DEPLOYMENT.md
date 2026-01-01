# Deployment Guide

This face recognition app is a fully client-side React application and can be deployed to any static hosting service.

## ✅ Build Successful
- Production build: Ready ✓
- Models included: 12MB ✓
- Total bundle: ~870KB JS + 12KB CSS ✓

---

## 🚀 Recommended: Deploy to Vercel

### Method 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration (Best for CI/CD)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "New Project"
5. Import your repository
6. Click "Deploy" (Vercel auto-detects Vite)
7. Done! ✨

**Your app will be live at:** `https://your-project-name.vercel.app`

---

## 🌐 Alternative: Deploy to Netlify

### Method 1: Drag & Drop

```bash
# Already built! Just drag the 'dist' folder to:
# https://app.netlify.com/drop
```

### Method 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Method 3: GitHub Integration

1. Go to [netlify.com](https://netlify.com)
2. "New site from Git"
3. Connect your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

---

## 📄 Alternative: GitHub Pages

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# 3. Update vite.config.js base path:
export default defineConfig({
  base: '/Face-recognition/',
  // ... rest of config
})

# 4. Deploy
npm run deploy
```

Then enable GitHub Pages in repository settings → Pages → Source: `gh-pages` branch

---

## ⚙️ Environment Notes

### Camera Permissions
- **HTTPS Required**: Modern browsers require HTTPS for camera access
- All recommended platforms provide HTTPS by default
- LocalStorage works on all platforms

### Model Files
- ML models (12MB) are included in build
- Served from `/models/` directory
- Cached by browsers after first load

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (HTTPS required)

---

## 🔍 Testing Deployment

After deployment:

1. **Camera Access**: Allow camera permissions
2. **Model Loading**: Wait 2-3 seconds for models to load
3. **Save Face**: Test saving a face
4. **Recognition**: Test face recognition
5. **LocalStorage**: Data persists across page reloads

---

## 📊 Performance

- First load: ~870KB + 12MB models (cached after first visit)
- Subsequent loads: ~870KB (models cached)
- Recognition: 10 FPS real-time
- Works offline after first load (PWA-ready)

---

## 🎯 Post-Deployment

Your app will:
- ✅ Work on desktop and mobile
- ✅ Use browser camera (HTTPS required)
- ✅ Store data in browser LocalStorage
- ✅ Work offline after first load
- ✅ Support multiple users (data is per-browser)

**Live URL**: Will be provided after deployment

---

## 🆘 Troubleshooting

### Camera not working
- Ensure HTTPS is enabled
- Check browser permissions
- Try different browser

### Models not loading
- Check browser console for errors
- Verify `/models/` directory exists in deployment
- Clear cache and reload

### Build fails
- Run `npm install` first
- Check Node.js version (v18+ recommended)
- Clear `node_modules` and reinstall

---

## 📝 Custom Domain (Optional)

Both Vercel and Netlify support custom domains:

1. Go to project settings
2. Add custom domain
3. Update DNS records
4. SSL certificate is automatic

---

**Need help?** Check the platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages Docs](https://pages.github.com)
