-- Create enum types for better data consistency
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE public.fitness_goal AS ENUM ('lose_weight', 'gain_muscle', 'maintain_weight', 'improve_endurance', 'general_fitness');
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'expired', 'cancelled');
CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE public.exercise_category AS ENUM ('cardio', 'strength', 'flexibility', 'sports', 'functional');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  age INTEGER,
  weight DECIMAL(5,2), -- in kg
  height DECIMAL(5,2), -- in cm
  gender gender_type,
  activity_level activity_level,
  fitness_goal fitness_goal,
  dietary_restrictions TEXT[],
  allergies TEXT[],
  target_calories INTEGER,
  target_protein DECIMAL(5,2),
  target_carbs DECIMAL(5,2),
  target_fat DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table to manage user payments
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status subscription_status NOT NULL DEFAULT 'trial',
  trial_start_date TIMESTAMPTZ DEFAULT now(),
  trial_end_date TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
  subscription_start_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create workout_plans table
CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  calories_burned_estimate INTEGER,
  muscle_groups TEXT[],
  equipment_needed TEXT[],
  ai_generated BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create exercises table for individual exercises within workout plans
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category exercise_category,
  instructions TEXT,
  sets INTEGER,
  reps INTEGER,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  weight_kg DECIMAL(5,2),
  distance_meters DECIMAL(8,2),
  order_index INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create nutrition_plans table
CREATE TABLE public.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_calories INTEGER,
  total_protein DECIMAL(5,2),
  total_carbs DECIMAL(5,2),
  total_fat DECIMAL(5,2),
  ai_generated BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create meals table for individual meals within nutrition plans
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nutrition_plan_id UUID NOT NULL REFERENCES public.nutrition_plans(id) ON DELETE CASCADE,
  meal_type meal_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fat DECIMAL(5,2),
  fiber DECIMAL(5,2),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create meal_foods table for individual food items within meals
CREATE TABLE public.meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL, -- grams, cups, pieces, etc.
  calories_per_unit DECIMAL(8,2),
  protein_per_unit DECIMAL(5,2),
  carbs_per_unit DECIMAL(5,2),
  fat_per_unit DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_progress table to track user's fitness journey
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  notes TEXT,
  photos TEXT[], -- URLs to progress photos
  measurements JSONB, -- flexible field for body measurements
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, recorded_date)
);

-- Create user_achievements table for gamification
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- workout_streak, weight_loss_goal, etc.
  achievement_name TEXT NOT NULL,
  description TEXT,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  value INTEGER -- streak days, weight lost, etc.
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for subscriptions table
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for workout_plans table
CREATE POLICY "Users can view their own workout plans" ON public.workout_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout plans" ON public.workout_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans" ON public.workout_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans" ON public.workout_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for exercises table
CREATE POLICY "Users can view exercises from their workout plans" ON public.exercises
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.workout_plans 
      WHERE id = exercises.workout_plan_id
    )
  );

CREATE POLICY "Users can insert exercises to their workout plans" ON public.exercises
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.workout_plans 
      WHERE id = exercises.workout_plan_id
    )
  );

CREATE POLICY "Users can update exercises from their workout plans" ON public.exercises
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.workout_plans 
      WHERE id = exercises.workout_plan_id
    )
  );

CREATE POLICY "Users can delete exercises from their workout plans" ON public.exercises
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.workout_plans 
      WHERE id = exercises.workout_plan_id
    )
  );

-- Create RLS policies for nutrition_plans table
CREATE POLICY "Users can view their own nutrition plans" ON public.nutrition_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own nutrition plans" ON public.nutrition_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition plans" ON public.nutrition_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition plans" ON public.nutrition_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meals table
CREATE POLICY "Users can view meals from their nutrition plans" ON public.meals
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.nutrition_plans 
      WHERE id = meals.nutrition_plan_id
    )
  );

CREATE POLICY "Users can insert meals to their nutrition plans" ON public.meals
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.nutrition_plans 
      WHERE id = meals.nutrition_plan_id
    )
  );

CREATE POLICY "Users can update meals from their nutrition plans" ON public.meals
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.nutrition_plans 
      WHERE id = meals.nutrition_plan_id
    )
  );

CREATE POLICY "Users can delete meals from their nutrition plans" ON public.meals
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.nutrition_plans 
      WHERE id = meals.nutrition_plan_id
    )
  );

-- Create RLS policies for meal_foods table
CREATE POLICY "Users can view foods from their meals" ON public.meal_foods
  FOR SELECT USING (
    auth.uid() IN (
      SELECT np.user_id FROM public.nutrition_plans np
      JOIN public.meals m ON np.id = m.nutrition_plan_id
      WHERE m.id = meal_foods.meal_id
    )
  );

CREATE POLICY "Users can insert foods to their meals" ON public.meal_foods
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT np.user_id FROM public.nutrition_plans np
      JOIN public.meals m ON np.id = m.nutrition_plan_id
      WHERE m.id = meal_foods.meal_id
    )
  );

CREATE POLICY "Users can update foods from their meals" ON public.meal_foods
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT np.user_id FROM public.nutrition_plans np
      JOIN public.meals m ON np.id = m.nutrition_plan_id
      WHERE m.id = meal_foods.meal_id
    )
  );

CREATE POLICY "Users can delete foods from their meals" ON public.meal_foods
  FOR DELETE USING (
    auth.uid() IN (
      SELECT np.user_id FROM public.nutrition_plans np
      JOIN public.meals m ON np.id = m.nutrition_plan_id
      WHERE m.id = meal_foods.meal_id
    )
  );

-- Create RLS policies for user_progress table
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress entries" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress entries" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress entries" ON public.user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_achievements table
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  
  INSERT INTO public.subscriptions (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile and subscription on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX idx_workout_plans_created_at ON public.workout_plans(created_at DESC);
CREATE INDEX idx_exercises_workout_plan_id ON public.exercises(workout_plan_id);
CREATE INDEX idx_nutrition_plans_user_id ON public.nutrition_plans(user_id);
CREATE INDEX idx_nutrition_plans_target_date ON public.nutrition_plans(target_date DESC);
CREATE INDEX idx_meals_nutrition_plan_id ON public.meals(nutrition_plan_id);
CREATE INDEX idx_meal_foods_meal_id ON public.meal_foods(meal_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_recorded_date ON public.user_progress(recorded_date DESC);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);