export { BuddyTipRepository } from './repositories/BuddyTipRepository';
export { DailyGoalRepository } from './repositories/DailyGoalRepository';
export { ReminderRepository } from './repositories/ReminderRepository';
export { SettingsRepository } from './repositories/SettingsRepository';
export { UserRepository } from './repositories/UserRepository';
export { WaterLogRepository } from './repositories/WaterLogRepository';

// Hooks
export { useToday, useWaterBuddy } from './hooks/useWaterBuddy';

// Types
export type { AppSettings, BuddyTip, DailyGoal, Reminder, User, WaterLog } from './types';

// Database
export { closeDatabase, getDatabase } from './database';

