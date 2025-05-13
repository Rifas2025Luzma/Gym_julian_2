import { create } from 'zustand';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

interface ProgressPhotos {
  front: string;
  back: string;
}

interface ProgressState {
  currentWeek: number;
  completedExercises: Set<string>;
  completedMeals: Set<string>;
  creatineChecked: Record<string, boolean>;
  progressPhotos: Record<string, ProgressPhotos>;
  setCurrentWeek: (week: number) => void;
  toggleExercise: (id: string) => void;
  toggleMeal: (id: string) => void;
  toggleCreatine: (dayId: string) => void;
  updateProgressPhotos: (week: number, type: 'front' | 'back', url: string) => void;
  initializeFirebase: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  currentWeek: 1,
  completedExercises: new Set<string>(),
  completedMeals: new Set<string>(),
  creatineChecked: {},
  progressPhotos: {},
  
  setCurrentWeek: (week: number) => {
    set({ currentWeek: week });
    const { completedExercises, completedMeals, creatineChecked } = get();
    syncWithFirebase(week, completedExercises, completedMeals, creatineChecked);
  },

  toggleExercise: (id: string) => {
    set((state) => {
      const newSet = new Set(state.completedExercises);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      syncWithFirebase(state.currentWeek, newSet, state.completedMeals, state.creatineChecked);
      return { completedExercises: newSet };
    });
  },

  toggleMeal: (id: string) => {
    set((state) => {
      const newSet = new Set(state.completedMeals);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      syncWithFirebase(state.currentWeek, state.completedExercises, newSet, state.creatineChecked);
      return { completedMeals: newSet };
    });
  },

  toggleCreatine: (dayId: string) => {
    set((state) => {
      const newCreatineChecked = {
        ...state.creatineChecked,
        [dayId]: !state.creatineChecked[dayId]
      };
      
      // Update Firebase immediately
      const creatineRef = ref(db, `progress/week${state.currentWeek}/creatine/${dayId}`);
      set(creatineRef, !state.creatineChecked[dayId]);
      
      return { creatineChecked: newCreatineChecked };
    });
  },

  updateProgressPhotos: (week: number, type: 'front' | 'back', url: string) => {
    set((state) => {
      const weekKey = `week${week}`;
      const currentPhotos = state.progressPhotos[weekKey] || { front: '', back: '' };
      const updatedPhotos = {
        ...state.progressPhotos,
        [weekKey]: {
          ...currentPhotos,
          [type]: url
        }
      };
      
      const photosRef = ref(db, `progress/photos`);
      set(photosRef, updatedPhotos);
      
      return { progressPhotos: updatedPhotos };
    });
  },

  initializeFirebase: () => {
    const { currentWeek } = get();
    
    // Listen to all progress data for the current week
    const weekRef = ref(db, `progress/week${currentWeek}`);
    onValue(weekRef, (snapshot) => {
      const data = snapshot.val() || {};
      set({
        completedExercises: new Set(data.exercises || []),
        completedMeals: new Set(data.meals || []),
        creatineChecked: data.creatine || {}
      });
    });

    // Listen to photos data
    const photosRef = ref(db, 'progress/photos');
    onValue(photosRef, (snapshot) => {
      const data = snapshot.val() || {};
      set({ progressPhotos: data });
    });
  }
}));

function syncWithFirebase(
  week: number, 
  exercises: Set<string>, 
  meals: Set<string>,
  creatine: Record<string, boolean>
) {
  const weekRef = ref(db, `progress/week${week}`);
  set(weekRef, {
    exercises: Array.from(exercises),
    meals: Array.from(meals),
    creatine
  });
}