# CareVoice - Technical Documentation Report

## 1. Project Overview
- **Purpose**: CareVoice is a modern, full-stack web application designed to revolutionize speech therapy by leveraging AI and machine learning.
- **Problem it Solves**: Traditional speech therapy can be expensive, inaccessible, and often lacks continuous, real-time feedback outside of clinic visits. CareVoice bridges this gap by providing an on-demand, private, and intelligent platform for daily speech practice and monitoring.
- **Key Features**: 
  - Real-time AI-powered speech analysis and pronunciation scoring
  - Adaptive learning system that adjusts difficulty dynamically based on user performance
  - Multi-language support (over 40+ languages)
  - Emotion tracking to monitor user sentiment during practice
  - Comprehensive analytics and progress tracking
  - Gamification (badges, streaks) and Pro subscription limits

## 2. Technology Stack Identification
- **Frontend Technologies**: 
  - **Framework/Library**: React 18.3 with TypeScript 5.8
  - **Build Tool**: Vite 5.4
  - **Styling**: Tailwind CSS 3.4 with shadcn/ui components (Radix UI)
  - **State Management & Data Fetching**: TanStack React Query 5.83
  - **Animations**: Framer Motion
- **Backend Technologies**: 
  - Backend-as-a-Service (BaaS) through **Supabase**.
  - Supabase Edge Functions for serverless compute and backend logic processing.
- **Database**: PostgreSQL (provided by Supabase), utilizing Row Level Security (RLS) for data protection.
- **APIs Used**: 
  - Supabase Auth API (Authentication & Google OAuth)
  - Supabase Database/Storage API
  - Stripe API for subscription and payment processing
- **AI/ML Tools**: Algorithm/Models integrated for Speech Analysis (pronunciation validation) and Emotion Detection.

## 3. Architecture
- **System Architecture**: Client-Server Serverless (BaaS) Architecture.
- **Interaction Flow**:
  - **Client Layer**: The Vite/React application runs in the browser, capturing audio inputs and user interactions.
  - **API/Middleware Layer**: The client communicates directly with Supabase via the Supabase Client SDK, sending audio objects, fetching therapy data, and saving scores.
  - **Compute/AI Layer**: Supabase Edge Functions or integrated external services process the audio arrays to return pronunciation confidence scores, recognized text, and emotion tags.
  - **Data Layer**: Results are parsed on the client side and mutations are sent securely (via RLS) to the PostgreSQL database on Supabase to track progression, triggers update user analytics seamlessly.

## 4. Modules & Components
- **Authentication & User Module**: Handles login, registration, Google OAuth, and initial onboarding (goal setting and difficulty preferences).
- **Dashboard & Analytics Module**: Renders charts (using Recharts), displays streaks, tracks progress, and showcases weak/learning sound matrices.
- **Therapy Engine Module**: The core module running the recording cycle, rendering exercises (tongue twisters, stories, etc.), evaluating audio streams hook-by-hook, and showing real-time feedback.
- **Gamification Module**: Manages achievements, badges, and user retention tools.
- **Subscription Module**: Interacts with Stripe to handle tier modifications natively (Free tier rate limits vs Pro tier functionality).
- **Admin/Therapist Module**: Specialized views enabling therapists to review and assign patient workloads.

## 5. Code Structure
- `src/components/`: Reusable, modular UI components broken down into subfolders (`ui/` for basic shadcn building blocks, `dashboard/` for charts, `therapy/` for session UI).
- `src/pages/`: Main route entries. Key files include `TherapySession.tsx`, `Dashboard.tsx`, `Onboarding.tsx`, and `Profile.tsx`.
- `src/hooks/`: Abstracted custom React hooks handling complex state and side-effects. (e.g., `useAudioRecorder.tsx`, `useSpeechAnalysis.tsx`, `useEmotionTracker.tsx`).
- `src/lib/`: Standalone core business logic and utilities (`exerciseGenerator.ts`, `adaptiveDifficulty.ts`).
- `src/integrations/supabase/`: Client initializations and auto-generated database types.

## 6. Features Explanation
- **Adaptive Therapy Sessions**: Generates customized exercises on the fly using `lib/exerciseGenerator.ts` by pulling from the user's past data. The system automatically inserts practice drills targeting words the user previously struggled with.
- **Real-Time Phoneme Analysis**: While audio is recorded, algorithms measure pronunciation accuracy word-by-word and instantly update the UI (highlighting correct vs skipped or mispronounced words).
- **Emotion Tracking System**: While in a session, an intelligent analyzer attempts to interpret user sentiment (e.g., frustrated, excited), storing these markers alongside results to contextually evaluate struggle points.
- **Weekly Progress & Streaks**: Hooks aggregate time-series data to present a weekly accuracy chart and manage a consecutive day usage tracker.

## 7. Deployment Details
- **Deployment Platform**: Ready for edge CDN platforms like Vercel, Netlify, or similar since it is a modern Vite/React SPA.
- **Environment Setup**: 
  - Requires Node.js 18+ and a package manager (npm or bun).
  - `.env` variables required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLIC_KEY`.
- **Database Configuration**: Relies directly on the Supabase CLI (`supabase db push`) to deploy schema migrations defining `profiles`, `sessions`, `exercise_results`, roles, and row-level security limits securely.

## 8. Improvements / Missing Parts
- **Incomplete/Limitations**: 
  - Audio processing relies heavily on network conditions and browser capabilities. Poor microphones might result in skewed analysis.
  - Lacks an offline-first practice mode; users must maintain a constant internet connection to operate speech validation pipelines.
- **Enhancements**: 
  - Implementing Web Workers for local fallback audio processing to decrease server latency.
  - Providing multi-modal feedback beyond audio (e.g., mouth shape visualizer integration via webcam).

## 9. Future Scope
- **Telehealth Integration**: Direct WebRTC video/audio bridges connecting users to certified speech pathologists for guided sessions seamlessly.
- **Custom Institutional Dashboards**: Expanding the Admin module into full-scale B2B offerings for schools and clinics, bulk patient management, and CSV reporting.
- **Advanced NLP**: Integrating Generative AI models to dynamically simulate real-life conversational scenarios (e.g., practicing ordering at a restaurant with an AI persona).

## 10. Summary
CareVoice is an innovative, highly scalable full-stack application built using React and Supabase that tackles the practical limitations of modern speech therapy. By relying on smart machine-learning analytics, robust cloud syncing, real-time feedback matrices, and excellent UI/UX principles, the platform provides users with an empathetic, accessible, and continuously adapting toolset designed to improve their speech confidence and ability. Suitable for wide distribution, the codebase stands as a testament to scalable serverless architectures integrating AI into healthcare-adjacent domains.
