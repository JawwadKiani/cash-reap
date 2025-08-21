import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNavigation } from "@/components/ui/top-navigation";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import CardDetails from "@/pages/card-details";
import MyCards from "@/pages/my-cards";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import CardBrowser from "@/pages/card-browser";
import PurchasePlanner from "@/pages/purchase-planner";
import RewardCalculator from "@/pages/reward-calculator";
import WelcomeBonusTracker from "@/pages/welcome-bonus-tracker";
import CardComparison from "@/pages/card-comparison";
import SpendingAnalyticsPage from "@/pages/spending-analytics";
import InsightsDashboard from "@/pages/insights-dashboard";
import AIRecommendations from "@/pages/ai-recommendations";
import LandingPage from "@/pages/landing";
import { SignIn, SignUp } from "@/pages/auth";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import FAQ from "@/pages/faq";
import NotFound from "@/pages/not-found";


function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <TopNavigation />
      <div className="pt-16">
        <Switch>
          {!isAuthenticated ? (
            <>
              <Route path="/" component={LandingPage} />
              <Route path="/signin" component={SignIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/privacy" component={PrivacyPolicy} />
              <Route path="/terms" component={TermsOfService} />
              <Route path="/faq" component={FAQ} />
            </>
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/card/:id" component={CardDetails} />
              <Route path="/my-cards" component={MyCards} />
              <Route path="/history" component={History} />
              <Route path="/settings" component={Settings} />
              <Route path="/card-browser" component={CardBrowser} />
              <Route path="/purchase-planner" component={PurchasePlanner} />
              <Route path="/reward-calculator" component={RewardCalculator} />
              <Route path="/welcome-bonus-tracker" component={WelcomeBonusTracker} />
              <Route path="/card-comparison" component={CardComparison} />
              <Route path="/spending-analytics" component={SpendingAnalyticsPage} />
              <Route path="/insights-dashboard" component={InsightsDashboard} />
              <Route path="/ai-recommendations" component={AIRecommendations} />
              <Route path="*" component={NotFound} />
            </>
          )}
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
