# 🍅 FocusFlow - Your Ultimate Focus Companion

<div align="center">
  <img src="public/favicon.ico" alt="FocusFlow Logo" width="80" height="80">
  
  **A minimalistic, dark-themed Pomodoro platform built for deep work and self-growth**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)
  
  [🚀 Live Demo](https://focusflow-demo.vercel.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/yourusername/focusflow/issues) • [✨ Request Feature](https://github.com/yourusername/focusflow/issues)
</div>

---

## ✨ Features

### 🎯 **Smart Pomodoro Timer**
- Customizable focus sessions (25 minutes default)
- Intelligent break reminders (5 minutes default)
- Beautiful circular progress indicator
- Visual and audio notifications
- Session completion tracking

### 📋 **Task Management**
- Intuitive task creation and organization
- Progress tracking with Pomodoro counts
- Task completion status
- Drag-and-drop functionality
- Real-time updates

### 📊 **Analytics & Insights**
- Daily, weekly, and monthly productivity stats
- Focus time tracking
- Task completion rates
- Personalized improvement suggestions
- Performance trends visualization

### 🎨 **Beautiful UI/UX**
- Dark-themed minimalistic design
- Smooth animations with Framer Motion
- Fully responsive across all devices
- Accessible design patterns
- Modern glassmorphism effects

### 🔐 **User Authentication**
- Secure login/signup system
- Google OAuth integration
- Password reset functionality
- Session management
- User profile customization

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/focusflow.git
   cd focusflow
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

\`\`\`
focusflow/
├── app/                    # Next.js 13+ App Router
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Additional styles
└── types/                # TypeScript type definitions
\`\`\`

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React

### **Backend & Database**
- **Authentication:** NextAuth.js
- **Database:** (Ready for integration)
- **API:** Next.js API Routes

### **Development Tools**
- **Package Manager:** npm/yarn
- **Linting:** ESLint
- **Formatting:** Prettier
- **Version Control:** Git

---

## 📱 Screenshots

<div align="center">
  <img src="docs/screenshots/landing.png" alt="Landing Page" width="45%">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="45%">
</div>

<div align="center">
  <img src="docs/screenshots/timer.png" alt="Timer" width="45%">
  <img src="docs/screenshots/analytics.png" alt="Analytics" width="45%">
</div>

---

## 🎮 Usage

### **Starting a Focus Session**
1. Navigate to the Timer tab
2. Add tasks you want to work on
3. Click "Start" to begin your 25-minute focus session
4. Take a 5-minute break when the timer completes
5. Repeat for optimal productivity

### **Managing Tasks**
- Click the "+" button to add new tasks
- Set target Pomodoro counts for each task
- Mark tasks as complete when finished
- Track progress with the built-in progress bars

### **Viewing Analytics**
- Check your daily session count
- Review weekly productivity patterns
- Monitor task completion rates
- Get personalized insights and suggestions

---

## 🔧 Configuration

### **Timer Settings**
Customize your Pomodoro experience in the Settings tab:
- Focus duration (default: 25 minutes)
- Break duration (default: 5 minutes)
- Long break duration (default: 15 minutes)
- Sessions before long break (default: 4)

### **Notifications**
- Browser notifications for session completion
- Sound alerts (customizable)
- Visual indicators

---

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy with one click

### **Other Platforms**
- **Netlify:** Follow their Next.js deployment guide
- **Railway:** Use their Next.js template
- **Docker:** Use the included Dockerfile

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Make your changes**
4. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add some amazing feature'
   \`\`\`
5. **Push to the branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
6. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📋 Roadmap

### **Phase 1: Core Features** ✅
- [x] Pomodoro timer functionality
- [x] Task management system
- [x] Basic analytics
- [x] User authentication
- [x] Responsive design

### **Phase 2: Enhanced Features** 🚧
- [ ] Team collaboration
- [ ] Advanced analytics
- [ ] Custom themes
- [ ] Sound customization
- [ ] Calendar integration

### **Phase 3: Advanced Features** 📋
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] API for third-party integrations
- [ ] Advanced reporting
- [ ] AI-powered insights

---

## 🐛 Known Issues

- Timer may not work properly when browser tab is inactive (browser limitation)
- Notifications require user permission
- Some animations may be reduced on low-performance devices

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Pomodoro Technique** by Francesco Cirillo
- **shadcn/ui** for the beautiful component library
- **Vercel** for hosting and deployment
- **Next.js team** for the amazing framework
- **All contributors** who help make this project better

---

## 📞 Support

- **Documentation:** [Wiki](https://github.com/yourusername/focusflow/wiki)
- **Issues:** [GitHub Issues](https://github.com/yourusername/focusflow/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/focusflow/discussions)
- **Email:** support@focusflow.app

---

<div align="center">
  <p>Made with ❤️ by the FocusFlow team</p>
  <p>
    <a href="https://github.com/yourusername/focusflow">⭐ Star us on GitHub</a> •
    <a href="https://twitter.com/focusflow">🐦 Follow on Twitter</a> •
    <a href="https://focusflow.app">🌐 Visit Website</a>
  </p>
</div>
