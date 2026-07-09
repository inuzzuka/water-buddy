import { useToday, useWaterBuddy, WaterBuddyDB } from '@/db/hooks/useWaterBuddy';
import { BuddyTipRepository } from '@/db/repositories/BuddyTipRepository';
import { UserRepository } from '@/db/repositories/UserRepository';
import { BuddyTip, DailyGoal, User, WaterLog } from '@/db/types';
import { restoreReminderNotifications } from '@/services/notificationService';
import { createContext, useContext, useEffect, useState } from 'react';

type WaterBuddyContextType = {
  ready: boolean;
  user: User | null;
  goal: DailyGoal | null;
  logs: WaterLog[];
  remaining: number | null;
  tip: BuddyTip | null;
  db: WaterBuddyDB;
  reminderSettings: ReminderSettings | null;
  quietHours: QuietHoursSettings | null;
  defaultQuickAddMl: number;
  appSettings: AppSettings | null;
  setDefaultQuickAddMl: (ml: number) => void | Promise<void>;
  logDrink: (amount_ml: number, label?: string) => Promise<void>;
  refreshSettings: () => Promise<void>;
  deleteLog: (id: number) => Promise<void>;
};

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

const WaterBuddyContext = createContext<WaterBuddyContextType | null>(null);

export function WaterBuddyProvider({ children }: { children: React.ReactNode }) {
  const { ready, db } = useWaterBuddy();
  const [user, setUser] = useState<User | null>(null);
  const [tip, setTip] = useState<BuddyTip | null>(null);
  const [defaultQuickAddMl, setDefaultQuickAddMlState] = useState(400);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings | null>(null);
  const [quietHours, setQuietHours] = useState<QuietHoursSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    sound: true,
  });

  useEffect(() => {
    if (!ready) return;
    (async () => {
      const userRepo = new UserRepository();
      let foundUser = await userRepo.findById(1);
      if (!foundUser) {
        const id = await userRepo.insert({
          first_name: 'Buddy',
          last_name: '',
          email: 'local@waterbuddy.app',
          password: '',
          level: 1,
          xp: 0,
        });
        foundUser = await userRepo.findById(id);
      }
      if (foundUser?.id) {
        setUser(foundUser);
        await db.dailyGoals.recalculateStreak(foundUser.id);
        const buddyTipRepo = new BuddyTipRepository();
        await buddyTipRepo.seedDefaultTips(foundUser.id);
        const nextTip = await buddyTipRepo.getNextTip(foundUser.id);
        setTip(nextTip);
        const settings = await db.settings.getForUser(foundUser.id);
        if (settings?.default_quick_add_ml) {
          setDefaultQuickAddMlState(settings.default_quick_add_ml);
        }
        const reminders = await db.reminders.getForUser(foundUser.id);

        if (!reminders) return;

        setReminderSettings({
          enabled: reminders.enabled === 1,
          frequency: reminders.frequency_minutes,
        });

        setQuietHours({
          enabled: reminders.quiet_hours_enabled === 1,
          start: reminders.quiet_start,
          end: reminders.quiet_end,
        });

        // restore notifications if missing
        await restoreReminderNotifications({
          enabled: reminders.enabled === 1,
          frequencyMinutes: reminders.frequency_minutes,
          quietHours: {
            enabled: reminders.quiet_hours_enabled === 1,
            start: reminders.quiet_start,
            end: reminders.quiet_end,
          },
          sound: settings?.sound !== 0,
        });
        await refreshSettings();
      }
    })();
  }, [ready]);

  const { goal, logs, remaining, refresh } = useToday(user?.id ?? 0);

  const refreshSettings = async () => {
    if (!user?.id) return;

    const updatedUser = await db.users.findById(user.id);

    if (updatedUser) {
      setUser(updatedUser);
    }

    const reminders = await db.reminders.getForUser(user.id);

    if (!reminders) return;

    setReminderSettings({
      enabled: reminders.enabled === 1,
      frequency: reminders.frequency_minutes,
    });

    setQuietHours({
      enabled: reminders.quiet_hours_enabled === 1,
      start: reminders.quiet_start,
      end: reminders.quiet_end,
    });

    const settings = await db.settings.getForUser(user.id);
    setAppSettings({
      sound: settings?.sound !== 0,
    });

    refresh();
  };

  const logDrink = async (amount_ml: number, label = 'Water') => {
    if (!user?.id) return;
    const result = await db.waterLogs.logDrink(user.id, amount_ml, label);
    if (result.newTotal >= (goal?.goal_ml ?? 2500)) {
      await db.dailyGoals.recalculateStreak(user.id);
    }
    refresh();
  };

  const setDefaultQuickAddMl = async (ml: number) => {
    setDefaultQuickAddMlState(ml);

    if (!user?.id) return;

    await db.settings.saveForUser(user.id, {
      default_quick_add_ml: ml,
    });
  };

  const deleteLog = async (id: number) => {
    if (!user?.id) return;
    await db.waterLogs.deleteLog(id, user.id);
    refresh();
  };

  return (
    <WaterBuddyContext.Provider
      value={{
        ready: ready && user !== null,
        user,
        goal,
        logs,
        remaining,
        tip,
        db,
        defaultQuickAddMl,
        reminderSettings,
        quietHours,
        appSettings,
        setDefaultQuickAddMl,
        logDrink,
        deleteLog,
        refreshSettings,
      }}>
      {children}
    </WaterBuddyContext.Provider>
  );
}

export function useWaterBuddyContext() {
  const ctx = useContext(WaterBuddyContext);
  if (!ctx) throw new Error('useWaterBuddyContext must be used inside WaterBuddyProvider');
  return ctx;
}
