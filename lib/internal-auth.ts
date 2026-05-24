import type { Role } from "@/lib/types";

const sessionKey = "jack-studio-service-session";
const superAdminId = "shern98";
const superAdminPassword = "980703";

export type InternalSession = {
  userId: string;
  displayName: string;
  role: Role;
};

export function signInInternal(userId: string, password: string) {
  if (userId.trim() !== superAdminId || password !== superAdminPassword) {
    throw new Error("Invalid ID or password.");
  }

  const session: InternalSession = {
    userId: superAdminId,
    displayName: "Super Admin",
    role: "super_admin"
  };

  window.sessionStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}

export function getInternalSession(): InternalSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.sessionStorage.getItem(sessionKey);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as InternalSession;
  } catch {
    window.sessionStorage.removeItem(sessionKey);
    return null;
  }
}

export function signOutInternal() {
  window.sessionStorage.removeItem(sessionKey);
}
