import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DriverData } from "./driver-schema";
import { generateUID } from "./driver-schema";

export type DriverStatus = "Active" | "Expired";

export interface DriverRecord extends DriverData {
  id: string;
  uid: string;
  createdAt: string;
  expiresAt: string;
  status: DriverStatus;
}

interface AdminUser {
  email: string;
  name: string;
}

interface StoreContext {
  drivers: DriverRecord[];
  addDriver: (data: DriverData) => DriverRecord;
  updateDriver: (id: string, data: DriverData) => DriverRecord | undefined;
  deleteDriver: (id: string) => void;
  getDriver: (id: string) => DriverRecord | undefined;
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const Ctx = createContext<StoreContext | null>(null);

const STORAGE_KEY = "dhic.drivers.v1";
const ADMIN_KEY = "dhic.admin.v1";

function seedDrivers(): DriverRecord[] {
  const now = Date.now();
  const mk = (i: number, status: DriverStatus): DriverRecord => ({
    id: `seed-${i}`,
    uid: generateUID(),
    fullName: ["Rahul Sharma", "Priya Verma", "Aman Khan", "Sneha Patel", "Vikram Singh"][i],
    dob: "1990-01-15",
    licenseNumber: `DL-14201100${10000 + i}`,
    insuranceId: `INS-${100000 + i}`,
    bloodGroup: (["A+", "B+", "O+", "AB-", "O-"] as const)[i],
    mobile: `98765${String(43210 + i).padStart(5, "0")}`,
    address: "12 MG Road, New Delhi, 110001",
    photo: "",
    createdAt: new Date(now - i * 86400000 * 30).toISOString(),
    expiresAt: new Date(now + (status === "Active" ? 365 : -10) * 86400000).toISOString(),
    status,
  });
  return [mk(0, "Active"), mk(1, "Active"), mk(2, "Expired"), mk(3, "Active"), mk(4, "Expired")];
}

export function DriverStoreProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<DriverRecord[]>([]);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setDrivers(raw ? JSON.parse(raw) : seedDrivers());
      const a = localStorage.getItem(ADMIN_KEY);
      if (a) setAdmin(JSON.parse(a));
    } catch {
      setDrivers(seedDrivers());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
  }, [drivers, hydrated]);

  const addDriver = useCallback((data: DriverData) => {
    const now = new Date();
    const rec: DriverRecord = {
      ...data,
      id: crypto.randomUUID?.() ?? `id-${Date.now()}`,
      uid: generateUID(),
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 5 * 365 * 86400000).toISOString(),
      status: "Active",
    };
    setDrivers((d) => [rec, ...d]);
    return rec;
  }, []);

  const updateDriver = useCallback((id: string, data: DriverData) => {
    let updated: DriverRecord | undefined;
    setDrivers((list) =>
      list.map((d) => {
        if (d.id !== id) return d;
        updated = { ...d, ...data };
        return updated;
      }),
    );
    return updated;
  }, []);

  const deleteDriver = useCallback((id: string) => {
    setDrivers((d) => d.filter((x) => x.id !== id));
  }, []);

  const getDriver = useCallback((id: string) => drivers.find((d) => d.id === id), [drivers]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || password.length < 4) return false;
    const user = { email, name: email.split("@")[0] || "Admin" };
    setAdmin(user);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
    return true;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_KEY);
  }, []);

  const value = useMemo<StoreContext>(
    () => ({ drivers, addDriver, updateDriver, deleteDriver, getDriver, admin, login, logout }),
    [drivers, addDriver, updateDriver, deleteDriver, getDriver, admin, login, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within DriverStoreProvider");
  return ctx;
}
