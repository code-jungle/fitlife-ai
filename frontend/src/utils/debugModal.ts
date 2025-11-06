// Utilitário para debug do modal
export const clearModalFlags = () => {
  localStorage.removeItem('profile_modal_dismissed');
  console.log('Modal flags cleared');
};

// Execute no console do navegador: clearModalFlags()
(window as any).clearModalFlags = clearModalFlags;
