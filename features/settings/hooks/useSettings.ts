import { useWaterBuddyContext } from "@/context/WaterBuddyContext";
import { useEffect, useMemo, useState } from "react";
import { ReminderService } from "../services/ReminderService";
import { SettingsService } from "../services/SettingsService";

type ReminderSettings = {
  enabled: boolean;
  frequency: number;
};

type QuietHoursSettings = {
  enabled: boolean;
  start: string;
  end: string;
};

type AppSettings = {
  sound: boolean;
};

export function useSettings() {
  const { db, user } = useWaterBuddyContext();

  const service = useMemo(
    () => new SettingsService(db.settings, db.reminders),
    [db],
  );

  const reminderService = useMemo(
    () => new ReminderService(db.reminders),
    [db],
  );

  const [defaultQuickAddMl, setDefaultQuickAddMlState] = useState(400);

  const [reminderSettings, setReminderSettings] =
    useState<ReminderSettings | null>(null);

  const [quietHours, setQuietHours] = useState<QuietHoursSettings | null>(null);

  const [appSettings, setAppSettings] = useState<AppSettings>({
    sound: true,
  });

  async function refreshSettings() {
    if (!user?.id) return;

    const data = await service.getSettings(user.id);

    const settings = data.settings;
    const reminders = data.reminders;

    if (settings?.default_quick_add_ml) {
      setDefaultQuickAddMlState(settings.default_quick_add_ml);
    }

    if (reminders) {
      setReminderSettings({
        enabled: reminders.enabled === 1,
        frequency: reminders.frequency_minutes,
      });

      setQuietHours({
        enabled: reminders.quiet_hours_enabled === 1,
        start: reminders.quiet_start,
        end: reminders.quiet_end,
      });
    }

    setAppSettings({
      sound: settings?.sound !== 0,
    });
  }

  async function setDefaultQuickAddMl(amount: number) {
    setDefaultQuickAddMlState(amount);

    if (!user?.id) return;

    await service.saveDefaultQuickAdd(user.id, amount);
  }

  async function saveReminder(enabled: boolean, frequency: number) {
    if (!user?.id) return;

    await reminderService.saveReminder(user.id, enabled, frequency);

    await refreshSettings();
  }

  async function saveQuietHours(enabled: boolean, start: string, end: string) {
    if (!user?.id) return;

    await reminderService.saveQuietHours(user.id, enabled, start, end);

    await refreshSettings();
  }

  async function saveSound(enabled: boolean) {
    if (!user?.id) return;

    await service.saveSound(user.id, enabled);

    await refreshSettings();
  }

  useEffect(() => {
    refreshSettings();
  }, [user?.id]);

  return {
    defaultQuickAddMl,
    setDefaultQuickAddMl,

    reminderSettings,
    quietHours,
    appSettings,

    refreshSettings,

    saveReminder,
    saveQuietHours,
    saveSound,
  };
}
