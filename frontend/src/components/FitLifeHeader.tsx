import BaseHeader from "@/components/ui/BaseHeader";
import { useLocation } from "react-router-dom";

const FitLifeHeader = () => {
  const location = useLocation();
  
  return (
    <BaseHeader 
      variant="fitlife"
      showLogout={location.pathname === '/dashboard'}
    />
  );
};

export default FitLifeHeader;