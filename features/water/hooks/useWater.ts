import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useToday } from "@/db/hooks/useToday";
import { waterService } from "../services";

export function useWater() {
  const { user } = useWaterBuddyContext();

  const { refresh } = useToday(user?.id ?? 0);

  async function addDrink(amountMl: number, label: string = "Water") {
    if (!user?.id) {
      throw new Error("User not available");
    }

    const result = await waterService.addDrink(user.id, amountMl, label);

    await refresh();

    return result;
  }

  return {
    addDrink,
  };
}
