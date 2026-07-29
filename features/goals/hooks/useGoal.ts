import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useToday } from "@/db/hooks/useToday";
import { useMemo } from "react";
import { GoalService } from "../services/GoalService";

export function useGoal() {
  const { user, db } = useWaterBuddyContext();

  const service = useMemo(() => new GoalService(db.dailyGoals), [db]);

  const { goal, remaining, refresh } = useToday(user?.id ?? 0);

  async function updateGoal(goalMl: number) {
    if (!user?.id) return;

    await service.updateGoal(user.id, goalMl);

    await refresh();
  }

  return {
    goal,
    remaining,
    refresh,
    updateGoal,
  };
}
