# 🌟 Kiddo Flashcards

An interactive Progressive Web App (PWA) designed to help children learn to read through word families and CVC (Consonant-Vowel-Consonant) words.

## Features

- 📚 **Word Families**: Learn rime patterns like "-at", "-an", "-og"
- 🔤 **CVC Words**: Practice simple 3-letter words like "cat", "dog", "sun"
- 🔊 **Text-to-Speech**: Tap cards to hear words spoken aloud
- 📱 **Mobile-First**: Optimized for tablets and phones
- 🎨 **Child-Friendly Design**: Bright colors and playful animations
- ⚡ **Offline Support**: Works without internet connection
- 🎯 **Interactive**: Tap animations and engaging feedback

## Deployment to Vercel

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if you don't have it):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   cd "/Users/monikakoppula/Desktop/Code/Flash cards"
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? **Your username**
   - Link to existing project? **N**
   - What's your project's name? **kiddo-flashcards** (or your preferred name)
   - In which directory is your code located? **./**

5. **Your app will be deployed!** Vercel will give you a URL like `https://kiddo-flashcards-xxx.vercel.app`

### Method 2: Deploy via GitHub + Vercel Dashboard

1. **Create a GitHub repository**:
   - Go to [GitHub.com](https://github.com)
   - Create a new repository (e.g., `kiddo-flashcards`)
   - Don't initialize with README (since you already have files)

2. **Push your code to GitHub**:
   ```bash
   cd "/Users/monikakoppula/Desktop/Code/Flash cards"
   git init
   git add .
   git commit -m "Initial commit: Kiddo Flashcards PWA"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/kiddo-flashcards.git
   git push -u origin main
   ```

3. **Deploy on Vercel**:
   - Go to [Vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your `kiddo-flashcards` repository
   - Click "Deploy"

### Method 3: Drag & Drop (Simplest)

1. **Prepare your files**:
   - Zip all your project files (index.html, styles.css, app.js, etc.)
   - Make sure to include the `vercel.json` file

2. **Deploy on Vercel**:
   - Go to [Vercel.com](https://vercel.com)
   - Sign up/login
   - Click "New Project"
   - Drag and drop your zip file
   - Click "Deploy"

## After Deployment

### Enable PWA Features
1. **Test your deployed app** in a mobile browser
2. **Install as PWA**: Look for "Add to Home Screen" option
3. **Test offline**: Turn off internet and verify the app still works

### Custom Domain (Optional)
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your custom domain

## Local Development

To run locally:
```bash
# Simple HTTP server (Python 3)
python -m http.server 8000

# Or using Node.js http-server
npx http-server

# Or using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## File Structure

```
Flash cards/
├── index.html              # Main HTML file
├── styles.css              # All styles and animations
├── app.js                  # App logic and functionality
├── service-worker.js       # PWA offline support
├── manifest.webmanifest    # PWA manifest
├── vercel.json            # Vercel deployment config
├── README.md              # This file
└── assets/
    └── icons/
        └── icon-192.png   # App icon
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **Vanilla JavaScript**: No frameworks needed
- **Progressive Web App**: Offline support and installable
- **Vercel**: Free hosting and deployment

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## License

This project is open source and available under the MIT License.
