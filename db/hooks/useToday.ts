import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useCallback, useEffect, useState } from "react";
import { DailyGoal, WaterLog } from "../types";

export function useToday(userId: number) {
  const { ready, db } = useWaterBuddyContext();

  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!ready || !userId) return;

    async function load() {
      const [g, l] = await Promise.all([
        db.dailyGoals.getToday(userId),
        db.waterLogs.getTodayLogs(userId),
      ]);

      setGoal(g);
      setLogs(l);
    }

    load();
  }, [ready, userId, refreshKey]);

  const remaining = goal
    ? Math.max(0, goal.goal_ml - (goal.consumed_ml ?? 0))
    : null;

  return {
    goal,
    logs,
    remaining,
    refresh,
  };
}
