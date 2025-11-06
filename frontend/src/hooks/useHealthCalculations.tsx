import { useMemo } from 'react';
import { UserProfile } from './useProfile';

interface BMICategory {
  category: string;
  type: 'positive' | 'negative' | 'warning' | 'neutral';
}

interface HealthStats {
  bmi: number | null;
  bmiCategory: BMICategory | null;
  activityLevelText: string;
  heightInMeters: number | null;
}

export const useHealthCalculations = (profile: UserProfile | null) => {
  // ✅ SEPARADO: Lógica de negócio no hook
  const calculateBMI = (weight: number, height: number): number | null => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const getBMICategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return { category: "Abaixo do peso", type: "warning" };
    if (bmi < 25) return { category: "Saudável", type: "positive" };
    if (bmi < 30) return { category: "Sobrepeso", type: "warning" };
    return { category: "Obesidade", type: "negative" };
  };

  const getActivityLevelText = (level: string): string => {
    const levels: Record<string, string> = {
      sedentary: "Sedentário",
      light: "Leve",
      moderate: "Moderado",
      active: "Ativo",
      very_active: "Muito Ativo"
    };
    return levels[level] || "Não definido";
  };

  // ✅ SEPARADO: useMemo para cálculos otimizados
  const healthStats = useMemo((): HealthStats => {
    if (!profile) {
      return {
        bmi: null,
        bmiCategory: null,
        activityLevelText: "Não definido",
        heightInMeters: null
      };
    }

    const bmi = profile.weight && profile.height 
      ? calculateBMI(profile.weight, profile.height) 
      : null;
    
    const bmiCategory = bmi ? getBMICategory(bmi) : null;
    const activityLevelText = profile.activity_level 
      ? getActivityLevelText(profile.activity_level) 
      : "Não definido";
    
    const heightInMeters = profile.height 
      ? parseFloat((profile.height / 100).toFixed(2)) 
      : null;

    return {
      bmi,
      bmiCategory,
      activityLevelText,
      heightInMeters
    };
  }, [profile]);

  return {
    ...healthStats,
    calculateBMI,
    getBMICategory,
    getActivityLevelText
  };
};

