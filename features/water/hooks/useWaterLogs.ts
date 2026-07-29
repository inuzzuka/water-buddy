import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useToday } from "@/db/hooks/useToday";
import { waterService } from "../services";

export function useWaterLogs() {
  const { user } = useWaterBuddyContext();

  const { logs, refresh } = useToday(user?.id ?? 0);

  async function deleteLog(id: number) {
    if (!user?.id) return;

    await waterService.deleteDrink(id, user.id);

    await refresh();
  }

  return {
    logs,
    refresh,
    deleteLog,
  };
}
