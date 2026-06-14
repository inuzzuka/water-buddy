/**
 * hooks/useWaterBuddy.ts — Water Buddy
 * Main hook: initialises the DB and exposes all repositories.
 *
 * Usage:
 *   const { ready, db } = useWaterBuddy();
 *   const logs = await db.waterLogs.getTodayLogs(userId);
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDatabase } from '../database';
import { BuddyTipRepository } from '../repositories/BuddyTipRepository';
import { DailyGoalRepository } from '../repositories/DailyGoalRepository';
import { ReminderRepository } from '../repositories/ReminderRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { UserRepository } from '../repositories/UserRepository';
import { WaterLogRepository } from '../repositories/WaterLogRepository';
import { DailyGoal, WaterLog } from '../types';

// ── Singletons ────────────────────────────────────────────────────────────────

const userRepository = new UserRepository();
const waterLogRepository = new WaterLogRepository();
const dailyGoalRepository = new DailyGoalRepository();
const reminderRepository = new ReminderRepository();
const settingsRepository = new SettingsRepository();
const buddyTipRepository = new BuddyTipRepository();

// ─── Hook return type ─────────────────────────────────────────────────────────

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

// ─── Main hook ────────────────────────────────────────────────────────────────

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
        console.error('[useWaterBuddy] Init failed:', err);
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

// ─── useToday ─────────────────────────────────────────────────────────────────
// Reactive hook for the home screen — call refresh() after logging a drink.

export function useToday(userId: number) {
  const { ready, db } = useWaterBuddy();
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    if (!ready || !userId) return;
    Promise.all([db.dailyGoals.getToday(userId), db.waterLogs.getTodayLogs(userId)]).then(([g, l]) => {
      setGoal(g);
      setLogs(l);
    });
  }, [ready, userId, refreshKey]);

  const remaining = goal ? Math.max(0, goal.goal_ml - (goal.consumed_ml ?? 0)) : null;

  return { goal, logs, remaining, refresh };
}
