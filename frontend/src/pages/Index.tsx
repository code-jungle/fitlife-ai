import FitLifeHeader from "@/components/FitLifeHeader";
import FitLifeHero from "@/components/FitLifeHero";
import FitLifeFeatures from "@/components/FitLifeFeatures";
import FitLifePricing from "@/components/FitLifePricing";
import FitLifeCTA from "@/components/FitLifeCTA";
import FitLifeFooter from "@/components/FitLifeFooter";
import SmoothScroll from "@/components/SmoothScroll";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SmoothScroll />
      <FitLifeHeader />
      <main>
        <FitLifeHero />
        <FitLifeFeatures />
        <FitLifePricing />
        <FitLifeCTA />
      </main>
      <FitLifeFooter />
    </div>
  );
};

export default Index;
