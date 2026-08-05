import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { waterService } from "../services";

export function useWater() {
  const { user, refreshWater, refreshAnalytics } = useWaterBuddyContext();

  async function addDrink(amountMl: number, label = "Water") {
    if (!user?.id) {
      throw new Error("User not available");
    }

    const result = await waterService.addDrink(user.id, amountMl, label);

    await refreshWater();
    refreshAnalytics();

    return result;
  }

  return {
    addDrink,
  };
}
