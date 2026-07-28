import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useState } from "react";
import { waterService } from "../services";

export function useWaterAnalytics() {
  const { user } = useWaterBuddyContext();

  const [chartData, setChartData] = useState<
    { date: string; total_ml: number }[]
  >([]);

  async function loadChart(period: string) {
    if (!user?.id) return;

    const days = period === "Week" ? 14 : 28;

    const from = new Date();

    from.setDate(from.getDate() - days + 1);

    const fromDate = from.toISOString().split("T")[0];

    const toDate = new Date().toISOString().split("T")[0];

    const data = await waterService.getDailyTotals(user.id, fromDate, toDate);

    setChartData(data);
  }

  return {
    chartData,
    loadChart,
  };
}
