import { BaseRepository } from '../BaseRepository';
import type { DailyGoal } from '../types';
import { isoDate, now, offsetDate, yesterday } from '../utils/dateHelpers';

export class DailyGoalRepository extends BaseRepository<DailyGoal> {
  protected tableName = 'daily_goals';

  async getToday(userId: number): Promise<DailyGoal | null> {
    return this.findOne({
      where: { clause: 'user_id = ? AND date = ?', args: [userId, isoDate()] },
    });
  }

  /** Last N days of rows — drives the Weekly/Monthly bar chart. */
  async getRange(userId: number, days: number): Promise<DailyGoal[]> {
    const db = await this.db();
    return db.getAllAsync<DailyGoal>(
      `SELECT * FROM daily_goals
       WHERE user_id = ? AND date >= date('now', ?)
       ORDER BY date ASC`,
      userId,
      `-${days} days`,
    );
  }

  /** Update the user's daily ml target. */
  async setGoal(userId: number, goal_ml: number): Promise<void> {
    await this.upsert({ user_id: userId, date: isoDate(), goal_ml, consumed_ml: 0, streak_days: 0, completed: 0 }, [
      'user_id',
      'date',
    ]);
  }

  /**
   * Recalculates the current streak by walking backwards through completed days.
   * Call once on app open after midnight rolls over.
   */
  async recalculateStreak(userId: number): Promise<number> {
    const db = await this.db();

    const rows = await db.getAllAsync<{ date: string; completed: number }>(
      `SELECT date, completed FROM daily_goals
       WHERE user_id = ? AND date < date('now')
       ORDER BY date DESC`,
      userId,
    );

    let streak = 0;
    let expected = yesterday();
    for (const row of rows) {
      if (row.date === expected && row.completed === 1) {
        streak++;
        expected = offsetDate(expected, -1);
      } else {
        break;
      }
    }

    await db.runAsync(
      `INSERT INTO daily_goals (user_id, date, goal_ml, consumed_ml, streak_days, completed)
       VALUES (?, ?, 2500, 0, ?, 0)
       ON CONFLICT(user_id, date) DO UPDATE SET streak_days = ?, updated_at = ?`,
      userId,
      isoDate(),
      streak,
      streak,
      now(),
    );

    return streak;
  }
}
