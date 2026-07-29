import MotivationCard from "@/components/journal/MotivationCard";
import TodayLogs from "@/components/journal/TodayLogs";
import WaterBarChart from "@/components/journal/WaterBarChart";
import WeeklyFlow from "@/components/journal/WeeklyFlow";
import ScreenContent from "@/components/layout/ScreenContent";
import { useGoal } from "@/features/goals/hooks/useGoal";
import { useWaterAnalytics } from "@/features/water/hooks/useWaterAnalytics";
import { useWaterLogs } from "@/features/water/hooks/useWaterLogs";

export default function Journal() {
  const { goal } = useGoal();

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

      <MotivationCard
        consumed_ml={goal?.consumed_ml ?? 0}
        goal_ml={goal?.goal_ml ?? 2500}
      />
    </ScreenContent>
  );
}
