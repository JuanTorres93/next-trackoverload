"use client";

import { Toaster } from "react-hot-toast";

import { DaySelectorProvider } from "../_features/meal/redesign/DaySelector";
import { RecipeSelectionProvider } from "../_features/recipe/redesign/RecipeSelectionForm";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DaySelectorProvider>
        <RecipeSelectionProvider>
          <Toaster position="top-center" />
          {children}
        </RecipeSelectionProvider>
      </DaySelectorProvider>
    </>
  );
}
