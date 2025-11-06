import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const LoadingState = ({ 
  message = "Carregando...", 
  size = 'md',
  fullScreen = false,
  className = ""
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen 
    ? "min-h-screen bg-background flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto mb-4 text-primary`} />
        <p className={`text-muted-foreground ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingState;

