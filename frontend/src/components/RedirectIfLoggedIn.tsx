import { useAuth } from '@/hooks/useAuth';

interface RedirectIfLoggedInProps {
  children: React.ReactNode;
}

const RedirectIfLoggedIn = ({ children }: RedirectIfLoggedInProps) => {
  const { user, loading: authLoading } = useAuth();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Carregando...</p>
        </div>
      </div>
    );
  }

  // Always render children (home page) - no automatic redirects
  return <>{children}</>;
};

export default RedirectIfLoggedIn;
