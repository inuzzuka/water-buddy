import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useEffect, useState } from "react";
import { waterService } from "../services";

type Period = "Week" | "Month";

export function useWaterAnalytics() {
  const { user, analyticsVersion } = useWaterBuddyContext();

  const [period, setPeriod] = useState<Period>("Week");

  const [chartData, setChartData] = useState<
    { date: string; total_ml: number }[]
  >([]);

  useEffect(() => {
    console.log("Loading analytics");

    async function loadChart() {
      if (!user?.id) return;

      const days = period === "Week" ? 14 : 28;

      const from = new Date();
      from.setDate(from.getDate() - days + 1);

      const data = await waterService.getDailyTotals(
        user.id,
        from.toISOString().split("T")[0],
        new Date().toISOString().split("T")[0],
      );

      console.log("Chart data:", data);

      setChartData(data);
    }

    loadChart();
  }, [user?.id, period, analyticsVersion]);

  return {
    chartData,
    period,
    setPeriod,
  };
}
