"use client";

import { Toaster } from "react-hot-toast";

import { DaySelectorProvider } from "../_features/meal/redesign/DaySelector";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DaySelectorProvider>
        <Toaster position="top-center" />
        {children}
      </DaySelectorProvider>
    </>
  );
}
