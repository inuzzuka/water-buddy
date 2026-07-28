import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useGoal } from "@/features/goals/hooks/useGoal";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useWater } from "@/features/water/hooks/useWater";
import { useWaterLogs } from "@/features/water/hooks/useWaterLogs";

export function useRitual() {
  const { user } = useWaterBuddyContext();

  const { defaultQuickAddMl, setDefaultQuickAddMl } = useSettings();

  const { addDrink } = useWater();

  const { goal } = useGoal();

  const { logs } = useWaterLogs();

  async function addWater(amount: number, label: string, saveDefault: boolean) {
    await addDrink(amount, label);

    if (saveDefault) {
      await setDefaultQuickAddMl(amount);
    }
  }

  return {
    user,
    goal,
    logs,
    defaultQuickAddMl,
    addWater,
  };
}
