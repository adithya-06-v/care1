import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleProvider } from "@/hooks/useRole";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import TherapySession from "./pages/TherapySession";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import TherapistAdmin from "./pages/TherapistAdmin";
import VideoCallPage from "./pages/VideoCall";
import ExercisePlayer from "./pages/ExercisePlayer";
import Games from "./pages/Games";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <RoleProvider>
          <SubscriptionProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/exercise/:id" element={<ExercisePlayer />} />
                <Route
                  path="/video-call/:roomId"
                  element={
                    <ProtectedRoute>
                      <VideoCallPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/therapy-session" element={<TherapySession />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/games" element={<Games />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route
                  path="/therapist"
                  element={
                    <ProtectedRoute requiredRole="therapist">
                      <TherapistAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/therapist-dashboard"
                  element={
                    <ProtectedRoute requiredRole="therapist">
                      <TherapistAdmin />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SubscriptionProvider>
        </RoleProvider>
      </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
