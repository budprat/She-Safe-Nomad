import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layout Components
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";

// Page Components
import HomePage from "@/components/HomePage";
import MapPage from "@/components/MapPage";
import CommunityPage from "@/components/CommunityPage";
import ContributePage from "@/components/ContributePage";
import PremiumPage from "@/components/PremiumPage";
import CertificationPage from "@/components/CertificationPage";
import AuthPage from "@/components/auth/AuthPage";
import NotFound from "./pages/NotFound";

// Admin Components
import AdminDashboard from "@/components/admin/AdminDashboard";
import ModerationQueue from "@/components/admin/ModerationQueue";
import UserManagement from "@/components/admin/UserManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth page - standalone without layout */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Main app routes with layout */}
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/premium" element={<PremiumPage />} />

              {/* Protected routes - require authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/contribute" element={<ContributePage />} />
                <Route path="/certification" element={<CertificationPage />} />
              </Route>
            </Route>

            {/* Admin routes - require admin privileges */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/moderation" element={<ModerationQueue />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
