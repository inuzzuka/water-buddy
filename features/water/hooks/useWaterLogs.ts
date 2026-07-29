import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { waterService } from "../services";

export function useWaterLogs() {
  const { user, logs, refreshWater } = useWaterBuddyContext();

  async function deleteLog(id: number) {
    if (!user?.id) return;

    await waterService.deleteDrink(id, user.id);

    await refreshWater();
  }

  return {
    logs,
    deleteLog,
  };
}
