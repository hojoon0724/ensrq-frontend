"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type GlobalPopupContextType = {
  open: boolean;
  show: () => void;
  hide: () => void;
};

const GlobalPopupContext = createContext<GlobalPopupContextType | null>(null);

export function GlobalPopupProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <GlobalPopupContext.Provider
      value={{
        open,
        show: () => setOpen(true),
        hide: () => setOpen(false),
      }}
    >
      {children}
    </GlobalPopupContext.Provider>
  );
}

export function useGlobalPopup() {
  const ctx = useContext(GlobalPopupContext);
  if (!ctx) {
    throw new Error("useGlobalPopup must be used within a GlobalPopupProvider");
  }
  return ctx;
}