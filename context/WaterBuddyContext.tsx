import { useWaterBuddy } from "@/db/hooks/useWaterBuddy";
import { UserRepository } from "@/db/repositories/UserRepository";
import { DailyGoal, User, WaterLog } from "@/db/types";
import { createContext, useContext, useEffect, useState } from "react";

type WaterBuddyContextType = {
  ready: boolean;
  user: User | null;
  db: ReturnType<typeof useWaterBuddy>["db"];

  goal: DailyGoal | null;
  logs: WaterLog[];
  consumedMl: number;

  refreshToday: () => Promise<void>;
};

const WaterBuddyContext = createContext<WaterBuddyContextType | null>(null);

export function WaterBuddyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, db } = useWaterBuddy();

  const [user, setUser] = useState<User | null>(null);

  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [consumedMl, setConsumedMl] = useState(0);

  async function refreshToday() {
    if (!user?.id) return;

    const [dailyGoal, todayLogs, totalConsumed] = await Promise.all([
      db.dailyGoals.getToday(user.id),
      db.waterLogs.getTodayLogs(user.id),
      db.waterLogs.getTodayTotal(user.id),
    ]);

    setGoal(dailyGoal);
    setLogs(todayLogs);
    setConsumedMl(totalConsumed);
  }

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

        const [dailyGoal, todayLogs, totalConsumed] = await Promise.all([
          db.dailyGoals.getToday(foundUser.id!),
          db.waterLogs.getTodayLogs(foundUser.id!),
          db.waterLogs.getTodayTotal(foundUser.id!),
        ]);

        setGoal(dailyGoal);
        setLogs(todayLogs);
        setConsumedMl(totalConsumed);
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

        goal,
        logs,
        consumedMl,

        refreshToday,
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
