import { useMemo } from 'react';
import { WorkoutPlan } from './useWorkouts';

interface WorkoutCardData {
  workoutLetter: string;
  mainMuscleGroups: string;
  difficultyText: string;
  durationText: string;
  equipmentText: string;
}

export const useWorkoutCard = (workout: WorkoutPlan) => {
  // ✅ SEPARADO: Lógica de negócio no hook
  const getWorkoutLetter = (title: string): string => {
    const match = title.match(/treino\s+([a-c])/i);
    return match ? match[1].toUpperCase() : 'A';
  };

  const getMainMuscleGroups = (muscleGroups: string[] | undefined): string => {
    if (!muscleGroups || muscleGroups.length === 0) {
      return 'Treino Geral';
    }
    return muscleGroups.slice(0, 2).join(' e ');
  };

  const getDifficultyText = (difficulty: number | undefined): string => {
    if (!difficulty) return 'Intermediário';
    
    if (difficulty <= 2) return 'Iniciante';
    if (difficulty <= 4) return 'Intermediário';
    return 'Avançado';
  };

  const getDurationText = (duration: number | undefined): string => {
    if (!duration) return 'Duração não definida';
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  const getEquipmentText = (equipment: string[] | undefined): string => {
    if (!equipment || equipment.length === 0) {
      return 'Sem equipamentos';
    }
    
    if (equipment.length === 1) {
      return equipment[0];
    }
    
    if (equipment.length <= 3) {
      return equipment.join(', ');
    }
    
    return `${equipment.slice(0, 2).join(', ')} e mais ${equipment.length - 2}`;
  };

  // ✅ SEPARADO: useMemo para cálculos otimizados
  const workoutCardData = useMemo((): WorkoutCardData => {
    return {
      workoutLetter: getWorkoutLetter(workout.title),
      mainMuscleGroups: getMainMuscleGroups(workout.muscle_groups),
      difficultyText: getDifficultyText(workout.difficulty_level),
      durationText: getDurationText(workout.duration_minutes),
      equipmentText: getEquipmentText(workout.equipment_needed)
    };
  }, [workout.title, workout.muscle_groups, workout.difficulty_level, workout.duration_minutes, workout.equipment_needed]);

  return {
    ...workoutCardData,
    getWorkoutLetter,
    getMainMuscleGroups,
    getDifficultyText,
    getDurationText,
    getEquipmentText
  };
};

