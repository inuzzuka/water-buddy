import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useEffect, useState } from "react";
import { waterService } from "../services";

type Period = "Week" | "Month";

export function useWaterAnalytics() {
  const { user } = useWaterBuddyContext();

  const [period, setPeriod] = useState<Period>("Week");

  const [chartData, setChartData] = useState<
    { date: string; total_ml: number }[]
  >([]);

  useEffect(() => {
    async function loadChart() {
      if (!user?.id) return;

      const days = period === "Week" ? 14 : 28;

      const from = new Date();
      from.setDate(from.getDate() - days + 1);

      const fromDate = from.toISOString().split("T")[0];
      const toDate = new Date().toISOString().split("T")[0];

      const data = await waterService.getDailyTotals(user.id, fromDate, toDate);

      setChartData(data);
    }

    loadChart();
  }, [user?.id, period]);

  return {
    chartData,
    period,
    setPeriod,
  };
}
