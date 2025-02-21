import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import Home from "./pages/home";
import PortfolioEditor from "./pages/portfolio/editor";
import PortfolioView from "./pages/portfolio/view";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolios" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/portfolio/editor" component={PortfolioEditor} />
      <ProtectedRoute path="/portfolio/editor/:id" component={PortfolioEditor} />
      <Route path="/portfolio/:id" component={PortfolioView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base="">
          <Router />
        </WouterRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
