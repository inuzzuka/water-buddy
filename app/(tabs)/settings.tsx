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
import { useEffect } from "react";

export default function Settings() {
  const { user, db } = useWaterBuddyContext();

  const {
    reminderSettings,
    quietHours,
    appSettings,
    refreshSettings,
    saveReminder,
    saveQuietHours,
    saveSound,
  } = useSettings();

  const { goal } = useGoal();

  const handleGoalChange = async (ml: number) => {
    if (!user?.id) return;

    await db.dailyGoals.setGoal(user.id, ml);
    await refreshSettings();
  };

  const handleSaveReminder = async (
    enabled: boolean,
    frequencyMinutes: number,
  ) => {
    await saveReminder(enabled, frequencyMinutes);
  };

  const handleSaveQuietHours = async (
    enabled: boolean,
    start: string,
    end: string,
  ) => {
    await saveQuietHours(enabled, start, end);
  };

  const handleSaveFeedback = async (sound: boolean) => {
    await saveSound(sound);
  };

  useEffect(() => {
    if (!user?.id) return;

    refreshSettings();
  }, [user?.id]);

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
        onSave={handleSaveReminder}
        initialEnabled={reminderSettings?.enabled ?? false}
        initialFrequency={reminderSettings?.frequency ?? 60}
      />

      <QuietHoursSection
        initialEnabled={quietHours?.enabled ?? false}
        initialStart={quietHours?.start ?? "22:00"}
        initialEnd={quietHours?.end ?? "07:00"}
        onSave={handleSaveQuietHours}
      />

      <FeedbackSection
        onSave={handleSaveFeedback}
        initialSound={appSettings?.sound}
      />
    </ScreenContent>
  );
}
