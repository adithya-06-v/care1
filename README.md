# CareVoice - AI-Powered Speech Therapy Platform
## 📋 Overview

CareVoice is a modern, full-stack web application designed to revolutionize speech therapy by leveraging AI and machine learning. The platform provides personalized therapy sessions, real-time speech analysis, adaptive difficulty progression, and comprehensive progress tracking across 40+ languages.

### 🎯 Core Capabilities

- **AI-Powered Speech Analysis**: Real-time pronunciation scoring and feedback
- **Adaptive Learning System**: Dynamic difficulty adjustment based on performance
- **Multi-Language Support**: Therapy sessions in 40+ languages
- **Emotion Tracking**: Sentiment analysis during therapy sessions
- **Progress Analytics**: Detailed performance metrics and visualizations
- **Gamification**: Achievement system with badges and streaks
- **Subscription Management**: Stripe-integrated Pro tier with unlimited sessions

---

## ✨ Features

### 🎤 **Therapy Sessions**
- **Personalized Exercises**: Word repetition, sentence reading, tongue twisters, storytelling, and breathing exercises
- **Real-Time Feedback**: Instant pronunciation scoring with AI-powered analysis
- **Word-Level Analysis**: Detailed breakdown of mispronounced words in sentences
- **Word Drill Mode**: Automatic insertion of practice exercises for challenging words
- **Focused Sound Practice**: Targeted sessions for specific phonemes and sound patterns
- **Adaptive Difficulty**: Exercises automatically adjust based on user performance
- **Session Customization**: Flexible duration (1-120 minutes) and therapy modes

### 📊 **Analytics & Tracking**
- **Weekly Performance Charts**: Visual representation of accuracy trends
- **Weak Sound Detection**: Identifies and prioritizes challenging phonemes
- **Mispronounced Words Dashboard**: Top problem words with practice recommendations
- **Session History**: Complete record of all therapy sessions with detailed metrics
- **Streak Tracking**: Daily practice streaks with longest streak records
- **Performance Badges**: Visual indicators for beginner, intermediate, advanced, and expert levels

### 🧠 **Intelligent Features**
- **Emotion Detection**: Tracks user sentiment (frustrated, struggling, neutral, confident, excited)
- **Adaptive Algorithm**: Mastery tracking (weak < 60%, learning 60-85%, mastered > 85%)
- **Smart Exercise Generation**: Based on user goals, difficulty level, and weak areas
- **Today's Focus**: Daily sound reinforcement recommendations
- **Sentence Performance Analysis**: Word count, accuracy, skipped words, and drill recommendations

### 🌍 **Multi-Language Support**
- Quick access to 6 major languages (English, Hindi, Bengali, Tamil, Telugu, Marathi)
- Full support for 40+ languages including regional Indian languages
- Language-specific pronunciation patterns and exercises

### 👤 **User Management**
- **Secure Authentication**: Email/password and Google OAuth integration
- **Role-Based Access**: Support for patient and therapist roles
- **Onboarding Flow**: Personalized profile creation with goals, difficulty, and preferences
- **Profile Management**: Customizable user settings and therapy preferences
- **Subscription Tiers**: Free plan (5 sessions/day) and Pro plan (unlimited sessions)

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with seamless tablet and desktop experiences
- **Dark Mode**: Eye-friendly dark theme throughout the application
- **Smooth Animations**: Framer Motion-powered transitions and interactions
- **Accessible Components**: shadcn/ui component library with ARIA support
- **Loading States**: Skeleton screens and progress indicators

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: React 18.3 with TypeScript 5.8
- **Build Tool**: Vite 5.4 (Fast HMR and optimized builds)
- **Styling**: Tailwind CSS 3.4 with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12.26
- **State Management**: TanStack React Query 5.83 (server state)
- **Routing**: React Router DOM 6.30
- **Form Handling**: React Hook Form 7.61 + Zod validation
- **Charts**: Recharts 2.15 (data visualization)
- **Icons**: Lucide React 0.462

### **Backend & Infrastructure**
- **Backend-as-a-Service**: Supabase 2.90
  - PostgreSQL database
  - Row Level Security (RLS) policies
  - Real-time subscriptions
  - Edge Functions for serverless compute
  - Storage for audio files
- **Authentication**: Supabase Auth (email/password, Google OAuth)
- **Payment Processing**: Stripe integration for Pro subscriptions
- **Hosting**: Vercel/Netlify compatible

### **Database Schema**
- **Core Tables**: 
  - `profiles`: User information and therapy settings
  - `sessions`: Therapy session records
  - `exercise_results`: Individual exercise performance
  - `sentence_performance`: Sentence-level analysis
  - `user_roles`: Role-based access control
  - `subscriptions`: Stripe subscription management
  - `achievements`: Gamification badges
  - `difficulty_progression`: Adaptive learning tracking

### **Development Tools**
- **Linting**: ESLint 9.32 with TypeScript support
- **Testing**: Vitest 3.2 + Testing Library
- **Package Manager**: npm / bun
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm (or bun)
- **Supabase Account** ([sign up free](https://supabase.com))
- **Stripe Account** (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/carevoice-speech-therapy.git
   cd carevoice-speech-therapy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
   ```

4. **Set up Supabase**
   
   Run the migrations in the `supabase/migrations/` directory to set up your database schema:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 📐 Architecture

### **Application Structure**

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/      # Dashboard-specific components
│   ├── therapy/        # Therapy session components
│   ├── admin/          # Therapist admin components
│   └── subscription/   # Subscription management
├── pages/              # Route components
│   ├── Auth.tsx        # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── TherapySession.tsx
│   ├── Progress.tsx
│   ├── Achievements.tsx
│   └── Profile.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication logic
│   ├── useAudioRecorder.tsx
│   ├── useSpeechAnalysis.tsx
│   ├── useEmotionTracker.tsx
│   └── useSubscription.tsx
├── lib/                # Utility functions
│   ├── exerciseGenerator.ts
│   ├── adaptiveDifficulty.ts
│   ├── weakSoundAnalysis.ts
│   ├── emotionDetection.ts
│   └── therapyModes.ts
├── integrations/       # External service integrations
│   └── supabase/
└── App.tsx             # Root component with routing
```

### **Key Design Patterns**

1. **Custom Hooks Pattern**: Encapsulation of complex logic (audio recording, speech analysis, emotion tracking)
2. **Provider Pattern**: Context providers for auth, role, and subscription state
3. **Protected Routes**: Route guards for authenticated and role-based access
4. **Real-Time Updates**: Supabase subscriptions for live data synchronization
5. **Optimistic UI Updates**: Immediate UI feedback with background data persistence

### **Data Flow**

1. User starts a therapy session
2. Exercise generator creates personalized exercises based on:
   - User profile (goals, difficulty, language)
   - Weak sounds and phonemes from past sessions
   - Adaptive difficulty progression
3. User records audio for each exercise
4. Speech analysis (via Supabase Edge Function or external API) provides:
   - Recognized text
   - Pronunciation score
   - Word-level analysis
   - Improvement tips
5. Results are saved to database with emotion tag
6. Adaptive difficulty system updates:
   - Weak exercises (score < 60%)
   - Learning exercises (60-85%)
   - Mastered exercises (> 85%)
7. Dashboard displays analytics and recommendations

---

## 🔐 Security

- **Row Level Security (RLS)**: All database tables have RLS policies
- **Authentication**: Secure token-based auth with Supabase
- **Environment Variables**: Sensitive keys stored in `.env` (not committed)
- **HTTPS**: Enforced in production
- **Input Validation**: Zod schemas for all form inputs
- **Protected Routes**: Authentication required for all app routes

---

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS with:

- **Color Palette**: Primary teal (`hsl(174, 73%, 50%)`), with semantic colors for success, warning, error
- **Typography**: Plus Jakarta Sans font family
- **Spacing**: Consistent 4px spacing scale
- **Border Radius**: Standardized border radius tokens
- **Shadows**: Elevation system with multiple shadow levels
- **Animations**: Custom easing functions and transition timings

---

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Deekshith**

- GitHub: [@yourusername](https://github.com/Deekshith-240)
- LinkedIn: [Your Name](https://www.linkedin.com/in/deekshith-gaddam-b0a099307/)

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Radix UI](https://www.radix-ui.com) for accessible primitives
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Stripe](https://stripe.com) for payment processing

---

<div align="center">

**Built with ❤️ to help people improve their speech**

⭐ Star this repo if you find it helpful!

</div>
