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
  creatineTaken: Set<string>;
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
  creatineTaken: new Set<string>(),
  progressPhotos: {},
  
  setCurrentWeek: (week: number) => {
    set({ currentWeek: week });
    const { completedExercises, completedMeals, creatineTaken } = get();
    syncWithFirebase(week, completedExercises, completedMeals, creatineTaken);
  },

  toggleExercise: (id: string) => {
    set((state) => {
      const newSet = new Set(state.completedExercises);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      syncWithFirebase(state.currentWeek, newSet, state.completedMeals, state.creatineTaken);
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
      syncWithFirebase(state.currentWeek, state.completedExercises, newSet, state.creatineTaken);
      return { completedMeals: newSet };
    });
  },

  toggleCreatine: (dayId: string) => {
    set((state) => {
      const newSet = new Set(state.creatineTaken);
      if (newSet.has(dayId)) {
        newSet.delete(dayId);
      } else {
        newSet.add(dayId);
      }
      syncWithFirebase(state.currentWeek, state.completedExercises, state.completedMeals, newSet);
      return { creatineTaken: newSet };
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
    // Initialize with empty sets first
    set({
      completedExercises: new Set<string>(),
      completedMeals: new Set<string>(),
      creatineTaken: new Set<string>(),
      progressPhotos: {}
    });

    const { currentWeek } = get();
    
    // Initialize progress data
    const progressRef = ref(db, `progress/week${currentWeek}`);
    onValue(progressRef, (snapshot) => {
      const data = snapshot.val() || { exercises: [], meals: [], creatine: [] };
      set({
        completedExercises: new Set(data.exercises || []),
        completedMeals: new Set(data.meals || []),
        creatineTaken: new Set(data.creatine || [])
      });
    });

    // Initialize photos data
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
  creatine: Set<string>
) {
  const progressRef = ref(db, `progress/week${week}`);
  set(progressRef, {
    exercises: Array.from(exercises),
    meals: Array.from(meals),
    creatine: Array.from(creatine)
  });
}