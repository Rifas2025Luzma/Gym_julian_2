import { create } from 'zustand';
import { ref, onValue, set, get as firebaseGet } from 'firebase/database';
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
    // Load data for the new week
    loadWeekData(week, get().completedExercises, get().completedMeals);
  },

  toggleExercise: (id: string) => {
    set((state) => {
      const newSet = new Set(state.completedExercises);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      
      // Save to Firebase immediately
      const weekRef = ref(db, `progress/week${state.currentWeek}/exercises`);
      set(weekRef, Array.from(newSet));
      
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
      
      // Save to Firebase immediately
      const weekRef = ref(db, `progress/week${state.currentWeek}/meals`);
      set(weekRef, Array.from(newSet));
      
      return { completedMeals: newSet };
    });
  },

  toggleCreatine: (week: number) => {
    set((state) => {
      const newStatus = {
        ...state.creatineStatus,
        [week]: !state.creatineStatus[week]
      };
      
      // Save to Firebase immediately
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
      
      // Save to Firebase immediately
      const photosRef = ref(db, 'progress/photos');
      set(photosRef, updatedPhotos);
      
      return { progressPhotos: updatedPhotos };
    });
  },

  initializeFirebase: () => {
    const { currentWeek } = get();
    
    // Initialize progress data for current week
    const weekRef = ref(db, `progress/week${currentWeek}`);
    onValue(weekRef, (snapshot) => {
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

// Helper function to load week data
function loadWeekData(week: number, exercises: Set<string>, meals: Set<string>) {
  const weekRef = ref(db, `progress/week${week}`);
  firebaseGet(weekRef).then((snapshot) => {
    const data = snapshot.val() || { exercises: [], meals: [] };
    set(weekRef, {
      exercises: Array.from(exercises),
      meals: Array.from(meals)
    });
  });
}