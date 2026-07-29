import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useWater } from "@/features/water/hooks/useWater";

export function useRitual() {
  const { user, goal, logs, consumedMl, refreshToday } = useWaterBuddyContext();

  const { defaultQuickAddMl, setDefaultQuickAddMl } = useSettings();

  const { addDrink } = useWater();

  async function addWater(amount: number, label: string, saveDefault: boolean) {
    await addDrink(amount, label);

    if (saveDefault) {
      await setDefaultQuickAddMl(amount);
    }

    await refreshToday();
  }

  return {
    user,
    goal,
    logs,
    consumedMl,
    defaultQuickAddMl,
    setDefaultQuickAddMl,
    addWater,
  };
}
