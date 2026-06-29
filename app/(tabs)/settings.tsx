import BuddyProfile from '@/components/features/BuddyProfile';
import DailyGoalSlider from '@/components/features/DailyGoalSlider';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';

export default function Settings() {
  const { user, goal, db, refresh } = useWaterBuddyContext();

  const handleGoalChange = async (ml: number) => {
    if (!user?.id) return;
    await db.dailyGoals.setGoal(user.id, ml);
    refresh();
  };
  return (
    <ScreenContent>
      {user && <BuddyProfile user={user} onManageAccount={() => {}} />}
      <DailyGoalSlider goalMl={goal?.goal_ml ?? 2500} onGoalChange={handleGoalChange} />
    </ScreenContent>
  );
}
