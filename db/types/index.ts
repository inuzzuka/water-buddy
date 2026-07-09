export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  level: number;
  xp: number;
  created_at?: string;
  updated_at?: string;
};

export type WaterLog = {
  id: number;
  user_id: number;
  amount_ml: number;
  label: string;
  logged_at?: string;
  created_at?: string;
};

export type DailyGoal = {
  id?: number;
  user_id: number;
  date: string; // ISO date 'YYYY-MM-DD'
  goal_ml: number;
  consumed_ml: number;
  streak_days: number;
  completed: 0 | 1;
  created_at?: string;
  updated_at?: string;
};

export type Reminder = {
  id?: number;
  user_id: number;
  enabled: 0 | 1;
  frequency_minutes: number; // 60 | 120 | custom
  quiet_start: string; // 'HH:MM'
  quiet_end: string; // 'HH:MM'
  quiet_hours_enabled: 0 | 1;
  updated_at?: string;
};

export type AppSettings = {
  id?: number;
  user_id: number;
  dark_mode: 0 | 1;
  sound: 0 | 1;
  default_quick_add_ml?: number;
  updated_at?: string;
};

export type BuddyTip = {
  id?: number;
  user_id: number;
  content: string;
  shown_at?: string | null;
  created_at?: string;
};
