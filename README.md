# 🚀  Portfolio - Bennie Joseph

A modern, interactive portfolio website built with Next.js, Three.js, and Framer Motion. Features an experience with 3D models, smooth animations, and a responsive design.

## ✨ Features

- **Modern Design**: Glass-morphism effects with a navy and mint green color scheme
- **3D Interactive Model**: Three.js powered 3D model with custom lighting
- **Smooth Animations**: Framer Motion animations throughout the site
- **Responsive Design**: Works perfectly on all devices
- **Gamified Experience**: Interactive elements and hover effects
- **Performance Optimized**: Built with Next.js 15 for optimal performance
- **TypeScript**: Fully typed for better development experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Email Service**: EmailJS
- **Sound Effects**: Custom audio integration

## 🚀 Deployment on Vercel

### Prerequisites
- Node.js 18+ installed
- Git repository
- Vercel account

### Step-by-Step Deployment

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js settings
   - Click "Deploy"

3. **Deploy via CLI**:
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy to production
   vercel --prod
   ```

### Environment Variables (if needed)
If you're using any API keys or secrets, add them in Vercel Dashboard:
- Go to Project Settings
- Navigate to Environment Variables
- Add your variables

### Custom Domain (Optional)
1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## 🏃‍♂️ Local Development

1. **Clone and Install**:
   ```bash
   git clone <your-repo-url>
   cd gamified-portfolio
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── CanvasWrapper.tsx  # Three.js canvas wrapper
│   ├── Certifications.tsx # Certifications section
│   ├── Contact.tsx        # Contact form
│   ├── Hero.tsx          # Hero section
│   ├── Navbar.tsx        # Navigation bar
│   ├── Projects.tsx      # Projects showcase
│   ├── Skills.tsx        # Skills section
│   ├── Work.tsx          # Work experience
│   └── models/           # 3D models
│       └── YourModel.tsx # Main 3D model component
public/
├── images/               # Images and logos
├── models/              # 3D model files
└── sounds/              # Audio files
```

## 🎨 Customization

### Colors
Update CSS variables in `src/app/globals.css`:
```css
:root {
  --color-primary: #64ffda;     /* Mint Green */
  --color-secondary: #0a192f;   /* Navy */
  --color-accent: #ff6b6b;      /* Coral */
}
```

### Content
- Update personal information in `src/components/Hero.tsx`
- Modify work experience in `src/components/Work.tsx`
- Add your projects in `src/components/Projects.tsx`
- Update certifications in `src/components/Certifications.tsx`

### 3D Model
Replace the model in `public/models/dog.glb` with your own 3D model and update the path in `src/components/models/YourModel.tsx`.

## 🔧 Build Optimizations

- **Image Optimization**: Using Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Tree Shaking**: Enabled by default
- **Minification**: Production builds are minified
- **Static Generation**: Pre-rendered for better performance

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Live Demo

Visit the live portfolio at: https://portfolio2k25-mu.vercel.app/

---

Built with ❤️ by Bennie Joseph
