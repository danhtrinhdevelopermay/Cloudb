import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth";
import SharePage from "@/pages/share";
import TermsPage from "@/pages/terms";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mb-4 mx-auto animate-pulse">
            <img src="/api/assets/gradient-cloud-icon.png" alt="SpacBSA Loading" className="w-16 h-16 rounded-2xl" />
          </div>
          <p className="text-gray-600">Loading SpacBSA...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={user ? Dashboard : AuthPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={user ? Dashboard : AuthPage} />
      <Route path="/share/:token" component={SharePage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AppRouter />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
