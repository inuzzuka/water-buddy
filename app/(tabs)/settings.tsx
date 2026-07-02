import BuddyProfile from '@/components/features/BuddyProfile';
import DailyGoalSlider from '@/components/features/DailyGoalSlider';
import RemindersSection, { scheduleReminders } from '@/components/features/RemindersSection';
import ScreenContent from '@/components/layout/ScreenContent';
import { useWaterBuddyContext } from '@/context/WaterBuddyContext';
import { useEffect, useState } from 'react';

export default function Settings() {
  const { user, goal, db, refresh } = useWaterBuddyContext();

  const handleGoalChange = async (ml: number) => {
    if (!user?.id) return;
    await db.dailyGoals.setGoal(user.id, ml);
    refresh();
  };

  const handleSaveReminder = async (enabled: boolean, frequencyMinutes: number) => {
    if (!user?.id) return;
    await db.reminders.saveForUser(user.id, {
      enabled: enabled ? 1 : 0,
      frequency_minutes: frequencyMinutes,
    });
  };

  const [reminderSettings, setReminderSettings] = useState<{ enabled: boolean; frequency: number }>({
    enabled: false,
    frequency: 60,
  });

  useEffect(() => {
    if (!user?.id) return;
    db.reminders.getForUser(user.id).then(async (r) => {
      if (!r) return;

      const enabled = r.enabled === 1;
      const frequency = r.frequency_minutes;

      setReminderSettings({
        enabled,
        frequency,
      });

      if (enabled) {
        await scheduleReminders(frequency);
      }
    });
  }, [user?.id]);

  return (
    <ScreenContent>
      {user && <BuddyProfile user={user} onManageAccount={() => {}} />}
      <DailyGoalSlider goalMl={goal?.goal_ml ?? 2500} onGoalChange={handleGoalChange} />
      <RemindersSection
        userId={user?.id ?? 0}
        onSave={handleSaveReminder}
        initialEnabled={reminderSettings.enabled}
        initialFrequency={reminderSettings.frequency}
      />
    </ScreenContent>
  );
}
