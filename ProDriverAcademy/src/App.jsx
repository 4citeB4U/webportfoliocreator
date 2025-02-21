import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ShowcasePage from "@/pages/showcase-page";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import HomePage from "@/pages/home-page";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import LoadingDashboard from "@/components/dashboard/LoadingDashboard";
import { useState, useEffect } from "react";

function Router() {
  const { user, isLoading } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Only update initial load state after auth check is complete
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Show loading animation during initial load
  if (isInitialLoad || isLoading) {
    return <LoadingDashboard />;
  }

  // If user is logged in, route based on role
  if (user) {
    if (user.role === 'admin') {
      return (
        <Switch>
          <Route path="/dashboard" component={AdminPage} />
          <Route path="/projects/pro-driver-academy" component={HomePage} />
          <Route path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/" component={ShowcasePage} />
          <Route path="/projects/pro-driver-academy" component={HomePage} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      );
    }
  }

  // Not logged in - only show auth page
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route>
        <Redirect to="/auth" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="relative min-h-screen">
          <Router />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;