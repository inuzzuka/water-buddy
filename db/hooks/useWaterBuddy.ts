import { useEffect, useRef, useState } from "react";
import { WaterLogRepository } from "../../features/water/repositories/WaterLogRepository";
import { getDatabase } from "../database";
import { BuddyTipRepository } from "../repositories/BuddyTipRepository";
import { DailyGoalRepository } from "../repositories/DailyGoalRepository";
import { ReminderRepository } from "../repositories/ReminderRepository";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository();
const waterLogRepository = new WaterLogRepository();
const dailyGoalRepository = new DailyGoalRepository();
const reminderRepository = new ReminderRepository();
const settingsRepository = new SettingsRepository();
const buddyTipRepository = new BuddyTipRepository();

export type WaterBuddyDB = {
  users: UserRepository;
  waterLogs: WaterLogRepository;
  dailyGoals: DailyGoalRepository;
  reminders: ReminderRepository;
  settings: SettingsRepository;
  buddyTips: BuddyTipRepository;
};

export type WaterBuddyHook = {
  ready: boolean;
  error: Error | null;
  db: WaterBuddyDB;
};

export function useWaterBuddy(): WaterBuddyHook {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;

    initialised.current = true;

    getDatabase()
      .then(() => setReady(true))
      .catch((err) => {
        console.error("[useWaterBuddy] Init failed:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      });
  }, []);

  return {
    ready,
    error,
    db: {
      users: userRepository,
      waterLogs: waterLogRepository,
      dailyGoals: dailyGoalRepository,
      reminders: reminderRepository,
      settings: settingsRepository,
      buddyTips: buddyTipRepository,
    },
  };
}
