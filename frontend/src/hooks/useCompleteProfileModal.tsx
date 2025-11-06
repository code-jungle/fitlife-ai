import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useProfileValidation } from '@/hooks/useProfileValidation';

export const useCompleteProfileModal = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isProfileComplete } = useProfileValidation({ skipValidation: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    // Verificar se deve mostrar o modal
    const profileComplete = isProfileComplete(profile);
    const shouldShowModal = 
      user && // Usuário logado
      !profileComplete && // Perfil incompleto
      !hasShownModal && // Modal ainda não foi mostrado nesta sessão
      !localStorage.getItem('profile_modal_dismissed'); // Modal não foi dispensado permanentemente

    console.log('Modal check:', { 
      user: !!user, 
      profile: profile, 
      profileComplete, 
      hasShownModal, 
      dismissed: !!localStorage.getItem('profile_modal_dismissed'),
      shouldShowModal 
    });

    if (shouldShowModal) {
      // Delay para garantir que a UI está pronta
      const timer = setTimeout(() => {
        console.log('Showing modal after delay');
        setIsModalOpen(true);
        setHasShownModal(true);
      }, 2000); // Aumentei o delay para 2 segundos

      return () => clearTimeout(timer);
    }
  }, [user, profile, isProfileComplete, hasShownModal]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const dismissModalPermanently = () => {
    setIsModalOpen(false);
    localStorage.setItem('profile_modal_dismissed', 'true');
  };

  // Limpar flag quando perfil for completado
  useEffect(() => {
    const profileComplete = isProfileComplete(profile);
    if (profileComplete) {
      localStorage.removeItem('profile_modal_dismissed');
      setIsModalOpen(false);
    }
  }, [profile, isProfileComplete]);

  return {
    isModalOpen,
    closeModal,
    dismissModalPermanently,
    isProfileComplete: isProfileComplete(profile)
  };
};
