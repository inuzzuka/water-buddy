import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { waterService } from "../services";

export function useWater() {
  const { user, refreshToday } = useWaterBuddyContext();

  async function addDrink(amountMl: number, label: string = "Water") {
    if (!user?.id) {
      throw new Error("User not available");
    }

    const result = await waterService.addDrink(user.id, amountMl, label);

    await refreshToday();

    return result;
  }

  return {
    addDrink,
  };
}
