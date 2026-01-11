import React, { createContext, useContext, useMemo, useState } from "react";

type Mode = "light" | "dark";
type ThemeCtx = {
  mode: Mode;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function AdminThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("light");
  const value = useMemo(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminTheme() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAdminTheme must be used inside AdminThemeProvider");
  return ctx;
}

// helper class switch
export function t(mode: Mode, light: string, dark: string) {
  return mode === "dark" ? dark : light;
}
