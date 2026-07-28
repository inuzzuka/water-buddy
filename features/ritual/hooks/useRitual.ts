import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useWater } from "@/features/water/hooks/useWater";

export function useRitual() {
  const { user, goal, defaultQuickAddMl, setDefaultQuickAddMl, tip, logs } =
    useWaterBuddyContext();

  const { addDrink } = useWater();

  async function addWater(amount: number, label: string, saveDefault: boolean) {
    await addDrink(amount, label);

    if (saveDefault) {
      await setDefaultQuickAddMl(amount);
    }
  }

  return {
    user,
    goal,
    tip,
    logs,
    defaultQuickAddMl,
    addWater,
  };
}
