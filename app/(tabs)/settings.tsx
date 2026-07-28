import ScreenContent from "@/components/layout/ScreenContent";
import BuddyProfile from "@/components/settings/BuddyProfile";
import DailyGoalSlider from "@/components/settings/DailyGoalSlider";
import FeedbackSection from "@/components/settings/FeedbackSection";
import QuietHoursSection from "@/components/settings/QuietHoursSection";
import RemindersSection from "@/components/settings/RemindersSection";
import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useGoal } from "@/features/goals/hooks/useGoal";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { router } from "expo-router";

export default function Settings() {
  const { user } = useWaterBuddyContext();

  const {
    reminderSettings,
    quietHours,
    appSettings,
    saveReminder,
    saveQuietHours,
    saveSound,
  } = useSettings();

  const { goal, updateGoal } = useGoal();

  const handleGoalChange = async (ml: number) => {
    await updateGoal(ml);
  };

  const handleSaveFeedback = async (sound: boolean) => {
    await saveSound(sound);
  };

  return (
    <ScreenContent>
      {user && (
        <BuddyProfile
          user={user}
          onManageAccount={() => router.push("/manage-account")}
        />
      )}

      <DailyGoalSlider
        goalMl={goal?.goal_ml ?? 2500}
        onGoalChange={handleGoalChange}
      />

      <RemindersSection
        onSave={saveReminder}
        initialEnabled={reminderSettings?.enabled ?? false}
        initialFrequency={reminderSettings?.frequency ?? 60}
      />

      <QuietHoursSection
        initialEnabled={quietHours?.enabled ?? false}
        initialStart={quietHours?.start ?? "22:00"}
        initialEnd={quietHours?.end ?? "07:00"}
        onSave={saveQuietHours}
      />

      <FeedbackSection onSave={saveSound} initialSound={appSettings?.sound} />
    </ScreenContent>
  );
}
