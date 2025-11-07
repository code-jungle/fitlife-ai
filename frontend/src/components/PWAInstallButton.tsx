import React, { useState, useEffect } from 'react';
import { Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      toast({
        title: 'App Instalado!',
        description: 'FitLife AI foi adicionado à sua tela inicial',
      });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show instructions for iOS or already installed
      if (isInstalled) {
        toast({
          title: 'App já instalado',
          description: 'FitLife AI já está na sua tela inicial',
        });
      } else {
        toast({
          title: 'Como instalar',
          description: 'No Safari: toque em Compartilhar > Adicionar à Tela Inicial',
        });
      }
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: 'Instalando...',
        description: 'FitLife AI está sendo instalado',
      });
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  // Show check icon if already installed
  if (isInstalled) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="text-green-500 hover:text-green-500"
      >
        <Check className="w-4 h-4 mr-2" />
        Instalado
      </Button>
    );
  }

  // Show install button if not installed
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleInstallClick}
      className="text-white/80 hover:text-white"
    >
      <Download className="w-4 h-4 mr-2" />
      Instalar App
    </Button>
  );
};

export default PWAInstallButton;
