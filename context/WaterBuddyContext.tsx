import { useWaterBuddy } from "@/db/hooks/useWaterBuddy";
import { UserRepository } from "@/db/repositories/UserRepository";
import { User } from "@/db/types";
import { createContext, useContext, useEffect, useState } from "react";

type WaterBuddyContextType = {
  ready: boolean;
  user: User | null;
  db: ReturnType<typeof useWaterBuddy>["db"];
};

const WaterBuddyContext = createContext<WaterBuddyContextType | null>(null);

export function WaterBuddyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, db } = useWaterBuddy();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!ready) return;

    async function initUser() {
      const userRepo = new UserRepository();

      let foundUser = await userRepo.findById(1);

      if (!foundUser) {
        const id = await userRepo.insert({
          first_name: "Buddy",
          last_name: "",
          email: "local@waterbuddy.app",
          password: "",
          level: 1,
          xp: 0,
        });

        foundUser = await userRepo.findById(id);
      }

      if (foundUser) {
        setUser(foundUser);

        await db.dailyGoals.recalculateStreak(foundUser.id!);
      }
    }

    initUser();
  }, [ready]);

  return (
    <WaterBuddyContext.Provider
      value={{
        ready: ready && user !== null,
        user,
        db,
      }}
    >
      {children}
    </WaterBuddyContext.Provider>
  );
}

export function useWaterBuddyContext() {
  const ctx = useContext(WaterBuddyContext);

  if (!ctx) {
    throw new Error(
      "useWaterBuddyContext must be used inside WaterBuddyProvider",
    );
  }

  return ctx;
}
