import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfileValidation } from '@/hooks/useProfileValidation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  skipProfileCheck?: boolean; // Para permitir acesso ao profile-setup mesmo sem perfil completo
}

const ProtectedRoute = ({ children, skipProfileCheck = false }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isProfileComplete } = useProfileValidation({ skipValidation: skipProfileCheck });
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (!skipProfileCheck && !isProfileComplete) {
        navigate('/profile-setup');
      }
    }
  }, [user, authLoading, isProfileComplete, navigate, skipProfileCheck]);

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

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;