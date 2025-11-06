import { Dumbbell, Heart, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import FeedbackButton from "./FeedbackButton";

const FitLifeFooter = () => {
  return (
    <footer className="bg-surface/50 border-t border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div className="font-orbitron font-bold text-xl gradient-text">
                FitLife AI
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Tem alguma sugestão ou feedback?
            </h3>
            <p className="text-white/70 text-sm mb-6">
              Sua opinião é muito importante para melhorarmos a aplicação!
            </p>
            <FeedbackButton />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <div className="text-white/60 text-sm">
            © 2025 - Powered by CodeJungle
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FitLifeFooter;