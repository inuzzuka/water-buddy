import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useToday } from "@/db/hooks/useWaterBuddy";

export function useGoal() {
  const { user } = useWaterBuddyContext();

  const { goal, remaining, refresh } = useToday(user?.id ?? 0);

  return {
    goal,
    remaining,
    refresh,
  };
}
