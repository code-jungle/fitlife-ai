# Estrutura de Features

Esta pasta contém todas as features do aplicativo organizadas por domínio de negócio.

## Estrutura Proposta

```
src/features/
├── auth/                    # Autenticação
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   └── useAuthValidation.tsx
│   ├── services/
│   │   └── authService.ts
│   ├── types/
│   │   └── auth.types.ts
│   └── index.ts
├── dashboard/               # Dashboard
│   ├── components/
│   │   ├── DashboardHeader.tsx
│   │   ├── QuickActions.tsx
│   │   ├── StatsGrid.tsx
│   │   └── ProgressOverview.tsx
│   ├── hooks/
│   │   └── useDashboard.tsx
│   ├── types/
│   │   └── dashboard.types.ts
│   └── index.ts
├── workouts/                # Treinos
│   ├── components/
│   │   ├── WorkoutCard.tsx
│   │   ├── WorkoutGenerator.tsx
│   │   ├── WorkoutStats.tsx
│   │   └── EmptyWorkoutState.tsx
│   ├── hooks/
│   │   ├── useWorkouts.tsx
│   │   └── useWorkoutCard.tsx
│   ├── services/
│   │   └── workoutService.ts
│   ├── types/
│   │   └── workout.types.ts
│   └── index.ts
├── nutrition/               # Nutrição
│   ├── components/
│   │   ├── MealCard.tsx
│   │   ├── NutritionGenerator.tsx
│   │   ├── NutritionSummary.tsx
│   │   └── EmptyNutritionState.tsx
│   ├── hooks/
│   │   ├── useNutrition.tsx
│   │   └── useMealCard.tsx
│   ├── services/
│   │   └── nutritionService.ts
│   ├── types/
│   │   └── nutrition.types.ts
│   └── index.ts
├── profile/                 # Perfil
│   ├── components/
│   │   ├── ProfileForm.tsx
│   │   ├── ActivityLevelStep.tsx
│   │   ├── GoalsStep.tsx
│   │   ├── PersonalInfoStep.tsx
│   │   └── RestrictionsStep.tsx
│   ├── hooks/
│   │   ├── useProfile.tsx
│   │   ├── useProfileValidation.tsx
│   │   └── useMacroCalculation.tsx
│   ├── services/
│   │   └── profileService.ts
│   ├── types/
│   │   └── profile.types.ts
│   └── index.ts
├── goals/                   # Metas
│   ├── components/
│   │   ├── GoalCard.tsx
│   │   ├── GoalForm.tsx
│   │   └── GoalsList.tsx
│   ├── hooks/
│   │   ├── useGoals.tsx
│   │   └── useGoalsTracking.tsx
│   ├── services/
│   │   └── goalsService.ts
│   ├── types/
│   │   └── goals.types.ts
│   └── index.ts
└── shared/                  # Compartilhado
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   └── common/
    ├── hooks/
    │   ├── useErrorHandler.tsx
    │   ├── useAsyncOperation.tsx
    │   └── useOptimizedOperations.tsx
    ├── services/
    │   └── apiService.ts
    ├── types/
    │   └── common.types.ts
    └── index.ts
```

## Benefícios

1. **Organização Clara**: Cada feature tem sua própria pasta
2. **Manutenibilidade**: Fácil encontrar e modificar código relacionado
3. **Escalabilidade**: Fácil adicionar novas features
4. **Reutilização**: Componentes compartilhados em `shared/`
5. **Testabilidade**: Cada feature pode ser testada independentemente
6. **Colaboração**: Diferentes desenvolvedores podem trabalhar em features diferentes

