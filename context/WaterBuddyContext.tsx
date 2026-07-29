import { useWaterBuddy } from "@/db/hooks/useWaterBuddy";
import { DailyGoal, User, WaterLog } from "@/db/types";
import { createContext, useContext, useEffect, useState } from "react";

type WaterBuddyContextType = {
  ready: boolean;
  user: User | null;
  db: ReturnType<typeof useWaterBuddy>["db"];

  goal: DailyGoal | null;

  consumedMl: number;

  logs: WaterLog[];

  refreshWater: () => void;
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

  const [consumedMl, setConsumedMl] = useState(0);

  const [logs, setLogs] = useState<WaterLog[]>([]);

  const refreshWater = async () => {
    if (!user?.id) return;

    const userId = user.id;

    const [todayGoal, todayLogs, total] = await Promise.all([
      db.dailyGoals.getToday(userId),
      db.waterLogs.getTodayLogs(userId),
      db.waterLogs.getTodayTotal(userId),
    ]);

    setGoal(todayGoal);
    setConsumedMl(total);
    setLogs(todayLogs);
  };

  useEffect(() => {
    if (!ready) return;

    async function initUser() {
      let foundUser = await db.users.findById(1);

      if (!foundUser) {
        const id = await db.users.insert({
          first_name: "Buddy",
          last_name: "",
          email: "local@waterbuddy.app",
          password: "",
          level: 1,
          xp: 0,
        });

        foundUser = await db.users.findById(id);
      }

      if (foundUser) {
        setUser(foundUser);

        if (!foundUser.id) return;

        await db.dailyGoals.recalculateStreak(foundUser.id);
      }
    }

    initUser().catch(console.error);
  }, [ready, db]);

  useEffect(() => {
    if (!ready || !user?.id) return;

    refreshWater().catch(console.error);
  }, [ready, user?.id]);

  return (
    <WaterBuddyContext.Provider
      value={{
        ready,
        user,
        db,

        goal,
        consumedMl,
        logs,

        refreshWater,
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
