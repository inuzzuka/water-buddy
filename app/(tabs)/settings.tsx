import BuddyProfile from '@/components/features/BuddyProfile';
import DailyGoalSlider from '@/components/features/DailyGoalSlider';
import FocusTimeSection from '@/components/features/QuietHoursSection';
import RemindersSection from '@/components/features/RemindersSection';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { updateReminderNotifications } from '@/services/notificationService';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function Settings() {
  const { user, db, goal, reminderSettings, quietHours, refreshSettings } = useWaterBuddyContext();

  const handleGoalChange = async (ml: number) => {
    if (!user?.id) return;

    await db.dailyGoals.setGoal(user.id, ml);
    await refreshSettings();
  };

  const refreshNotifications = async () => {
    if (!user?.id) return;

    const settings = await db.reminders.getForUser(user.id);
    await refreshNotifications();

    if (!settings) return;

    await updateReminderNotifications({
      enabled: settings.enabled === 1,
      frequencyMinutes: settings.frequency_minutes,
      quietHours: {
        enabled: settings.quiet_hours_enabled === 1,
        start: settings.quiet_start,
        end: settings.quiet_end,
      },
    });
  };

  const handleSaveReminder = async (enabled: boolean, frequencyMinutes: number) => {
    if (!user?.id) return;

    await db.reminders.saveForUser(user.id, {
      enabled: enabled ? 1 : 0,
      frequency_minutes: frequencyMinutes,
    });

    await refreshNotifications();

    await refreshSettings();
  };

  const handleSaveQuietHours = async (enabled: boolean, start: string, end: string) => {
    if (!user?.id) return;

    await db.reminders.saveForUser(user.id, {
      quiet_hours_enabled: enabled ? 1 : 0,
      quiet_start: start,
      quiet_end: end,
    });

    await refreshNotifications();

    await refreshSettings();
  };

  useEffect(() => {
    if (!user?.id) return;

    refreshSettings();
  }, [user?.id, refreshSettings]);

  return (
    <ScreenContent>
      {user && <BuddyProfile user={user} onManageAccount={() => router.push('/manage-account')} />}

      <DailyGoalSlider goalMl={goal?.goal_ml ?? 2500} onGoalChange={handleGoalChange} />

      <RemindersSection
        onSave={handleSaveReminder}
        initialEnabled={reminderSettings?.enabled ?? false}
        initialFrequency={reminderSettings?.frequency ?? 60}
      />

      <FocusTimeSection
        initialEnabled={quietHours?.enabled ?? false}
        initialStart={quietHours?.start ?? '22:00'}
        initialEnd={quietHours?.end ?? '07:00'}
        onSave={handleSaveQuietHours}
      />
    </ScreenContent>
  );
}
