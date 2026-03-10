import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ALERGENS_LIST = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy',
  'Fish', 'Shellfish', 'Sesame', 'Sulfites', 'Mustard',
  'Celery', 'Lupin', 'Molluscs'
] as const;

export type Allergen = typeof ALERGENS_LIST[number];

export interface UserState {
  hasCompletedOnboarding: boolean;
  isDiabetic: boolean;
  allergies: Allergen[];
  setHasCompletedOnboarding: (val: boolean) => void;
  setIsDiabetic: (val: boolean) => void;
  setAllergies: (allergies: Allergen[]) => void;
  toggleAllergy: (allergy: Allergen) => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      isDiabetic: false,
      allergies: [],
      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      setIsDiabetic: (val) => set({ isDiabetic: val }),
      setAllergies: (allergies) => set({ allergies }),
      toggleAllergy: (allergy) => set((state) => ({
        allergies: state.allergies.includes(allergy)
          ? state.allergies.filter(a => a !== allergy)
          : [...state.allergies, allergy]
      })),
      resetProfile: () => set({ hasCompletedOnboarding: false, isDiabetic: false, allergies: [] }),
    }),
    {
      name: 'scaneats-user-storage',
    }
  )
);
