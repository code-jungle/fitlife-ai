import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import RedirectIfLoggedIn from "@/components/RedirectIfLoggedIn";
import CompleteProfileModal from "@/components/modals/CompleteProfileModal";
import { useCompleteProfileModal } from "@/hooks/useCompleteProfileModal";
import "@/utils/debugModal"; // Para debug do modal
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CompleteRegistration from "@/pages/CompleteRegistration";
import ProfileSetup from "@/pages/ProfileSetup";
import ProfileManagement from "@/pages/ProfileManagement";
import GoalsTracking from "@/pages/GoalsTracking";
import WorkoutPlans from "@/pages/WorkoutPlans";
import NutritionPlans from "@/pages/NutritionPlans";
import NotFound from "@/pages/NotFound";

// Componente interno que usa o hook dentro do Router
const RouterContent = () => {
  const { isModalOpen, closeModal } = useCompleteProfileModal();

  return (
    <>
      <Routes>
        <Route path="/" element={
          <RedirectIfLoggedIn>
            <Index />
          </RedirectIfLoggedIn>
        } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-complete" element={<CompleteRegistration />} />
            <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile-setup" element={
          <ProtectedRoute skipProfileCheck={true}>
            <ProfileSetup />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileManagement />
          </ProtectedRoute>
        } />
        <Route path="/goals" element={
          <ProtectedRoute>
            <GoalsTracking />
          </ProtectedRoute>
        } />
        <Route path="/workouts" element={
          <ProtectedRoute>
            <WorkoutPlans />
          </ProtectedRoute>
        } />
        <Route path="/nutrition" element={
          <ProtectedRoute>
            <NutritionPlans />
          </ProtectedRoute>
        } />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal para completar perfil - agora dentro do Router */}
      <CompleteProfileModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

const AppWithModal = () => {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
};

export default AppWithModal;
