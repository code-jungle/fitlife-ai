import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { AppStateProvider } from "@/contexts/AppStateContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppWithModal from "@/components/AppWithModal";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppStateProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppWithModal />
          </TooltipProvider>
        </AppStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
