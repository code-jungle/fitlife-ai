import { Dumbbell, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface BaseHeaderProps {
  variant?: 'dashboard' | 'standard' | 'fitlife';
  title?: string;
  showBackButton?: boolean;
  backPath?: string;
  showLogout?: boolean;
  onLogout?: () => void;
  rightActions?: React.ReactNode;
}

const BaseHeader = ({ 
  variant = 'fitlife',
  title,
  showBackButton = false,
  backPath = "/dashboard",
  showLogout = false,
  onLogout,
  rightActions
}: BaseHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await signOut();
      navigate('/');
    }
  };

  const handleLogoClick = () => {
    if (variant === 'fitlife') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const renderLogo = () => (
    <div 
      className={`flex items-center gap-3 ${variant === 'fitlife' ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={variant === 'fitlife' ? handleLogoClick : undefined}
    >
      {variant === 'dashboard' ? (
        <img 
          src="/icon.svg" 
          alt="FitLife AI Logo" 
          className="w-10 h-10"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
      )}
      <div className="font-orbitron font-bold text-xl gradient-text">
        FitLife AI
      </div>
    </div>
  );

  const renderLeftContent = () => {
    if (variant === 'standard' && showBackButton) {
      return (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(backPath)}
            className="text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="h-6 w-px bg-white/20" />
          <h1 className="text-xl font-poppins font-bold gradient-text">
            {title}
          </h1>
        </div>
      );
    }

    if (variant === 'fitlife') {
      return renderLogo();
    }

    return null;
  };

  const renderRightContent = () => {
    if (rightActions) {
      return rightActions;
    }

    if (showLogout) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="btn-secondary"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {variant === 'standard' ? (
          <>
            {renderLeftContent()}
            {renderLogo()}
          </>
        ) : (
          <>
            {renderLeftContent()}
            {renderRightContent()}
          </>
        )}
      </div>
    </header>
  );
};

export default BaseHeader;

