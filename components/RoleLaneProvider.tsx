"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_ROLE, isRole, type Role } from "@/lib/roles";

const STORAGE_KEY = "portfolio_role_lane";

type RoleLaneValue = {
  role: Role;
  selectRole: (role: Role) => void;
};

const RoleLaneContext = createContext<RoleLaneValue | null>(null);

/**
 * The visitor's chosen lane, shared between the control in the Hero and the
 * ordering in Projects - they're siblings under app/page.tsx, so this can't
 * just be local state.
 *
 * Starts at DEFAULT_ROLE on both server and client and only reads localStorage
 * after mount, so the first client render matches the server's and hydration
 * stays quiet.
 */
export function RoleLaneProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(DEFAULT_ROLE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isRole(stored)) setRole(stored);
    } catch {
      // Private windows and blocked site data throw on access - the default lane is fine.
    }
  }, []);

  const selectRole = useCallback((next: Role) => {
    setRole(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisting is survivable; the selection still applies this session.
    }
  }, []);

  return <RoleLaneContext.Provider value={{ role, selectRole }}>{children}</RoleLaneContext.Provider>;
}

export function useRoleLane(): RoleLaneValue {
  const value = useContext(RoleLaneContext);
  if (!value) throw new Error("useRoleLane must be used inside RoleLaneProvider");
  return value;
}
