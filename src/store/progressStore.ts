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
  creatineStatus: Record<number, boolean>;
  progressPhotos: Record<string, ProgressPhotos>;
  setCurrentWeek: (week: number) => void;
  toggleExercise: (id: string) => void;
  toggleMeal: (id: string) => void;
  toggleCreatine: (week: number) => void;
  updateProgressPhotos: (week: number, type: 'front' | 'back', url: string) => void;
  initializeFirebase: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  currentWeek: 1,
  completedExercises: new Set<string>(),
  completedMeals: new Set<string>(),
  creatineStatus: {},
  progressPhotos: {},
  
  setCurrentWeek: (week: number) => {
    set({ currentWeek: week });
    const { completedExercises, completedMeals } = get();
    syncWithFirebase(week, completedExercises, completedMeals);
  },

  toggleExercise: (id: string) => {
    set((state) => {
      const newSet = new Set(state.completedExercises);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      syncWithFirebase(state.currentWeek, newSet, state.completedMeals);
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
      syncWithFirebase(state.currentWeek, state.completedExercises, newSet);
      return { completedMeals: newSet };
    });
  },

  toggleCreatine: (week: number) => {
    set((state) => {
      const newStatus = {
        ...state.creatineStatus,
        [week]: !state.creatineStatus[week]
      };
      
      const creatineRef = ref(db, 'progress/creatine');
      set(creatineRef, newStatus);
      
      return { creatineStatus: newStatus };
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
      progressPhotos: {},
      creatineStatus: {}
    });

    const { currentWeek } = get();
    
    // Initialize progress data
    const progressRef = ref(db, `progress/week${currentWeek}`);
    onValue(progressRef, (snapshot) => {
      const data = snapshot.val() || { exercises: [], meals: [] };
      set({
        completedExercises: new Set(data.exercises || []),
        completedMeals: new Set(data.meals || [])
      });
    });

    // Initialize photos data
    const photosRef = ref(db, 'progress/photos');
    onValue(photosRef, (snapshot) => {
      const data = snapshot.val() || {};
      set({ progressPhotos: data });
    });

    // Initialize creatine status
    const creatineRef = ref(db, 'progress/creatine');
    onValue(creatineRef, (snapshot) => {
      const data = snapshot.val() || {};
      set({ creatineStatus: data });
    });
  }
}));

function syncWithFirebase(week: number, exercises: Set<string>, meals: Set<string>) {
  const progressRef = ref(db, `progress/week${week}`);
  set(progressRef, {
    exercises: Array.from(exercises),
    meals: Array.from(meals)
  });
}