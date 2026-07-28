import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { waterService } from "../services";

export function useWater() {
  const { user } = useWaterBuddyContext();

  async function addDrink(amountMl: number, label: string = "Water") {
    if (!user?.id) {
      throw new Error("User not available");
    }

    return waterService.addDrink(user.id, amountMl, label);
  }

  return {
    addDrink,
  };
}
