import MotivationCard from "@/components/journal/MotivationCard";
import TodayLogs from "@/components/journal/TodayLogs";
import WaterBarChart from "@/components/journal/WaterBarChart";
import WeeklyFlow from "@/components/journal/WeeklyFlow";
import ScreenContent from "@/components/layout/ScreenContent";
import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useWaterAnalytics } from "@/features/water/hooks/useWaterAnalytics";
import { useWaterLogs } from "@/features/water/hooks/useWaterLogs";

export default function Journal() {
  const { goal, consumedMl } = useWaterBuddyContext();

  const { logs, deleteLog } = useWaterLogs();

  const { chartData, period, setPeriod } = useWaterAnalytics();

  return (
    <ScreenContent>
      <WeeklyFlow data={chartData} />

      <WaterBarChart
        data={chartData}
        goalMl={goal?.goal_ml ?? 2500}
        period={period}
        onPeriodChange={setPeriod}
      />

      <TodayLogs logs={logs} onDelete={deleteLog} />

      <MotivationCard consumedMl={consumedMl} goalMl={goal?.goal_ml ?? 2500} />
    </ScreenContent>
  );
}
