import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useMemo } from "react";
import { GoalService } from "../services/GoalService";

export function useGoal() {
  const { user, db, goal, consumedMl, refreshWater } = useWaterBuddyContext();

  const service = useMemo(() => new GoalService(db.dailyGoals), [db]);

  async function updateGoal(goalMl: number) {
    if (!user?.id) return;

    await service.updateGoal(user.id, goalMl);

    await refreshWater();
  }

  return {
    goal,
    consumedMl,
    updateGoal,
  };
}
