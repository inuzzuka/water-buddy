import { BaseRepository } from '../BaseRepository';
import type { WaterLog } from '../types';
import { isoDate, now } from '../utils/dateHelpers';

export class WaterLogRepository extends BaseRepository<WaterLog> {
  protected tableName = 'water_logs';

  /**
   * Log a drink and update the daily goal total in one transaction.
   * This is the primary write path — always use this instead of insert().
   */
  async logDrink(
    userId: number,
    amount_ml: number,
    label: string = 'Water',
  ): Promise<{ logId: number; newTotal: number }> {
    const db = await this.db();
    let logId = 0;
    let newTotal = 0;

    await db.execAsync('BEGIN');
    try {
      const result = await db.runAsync(
        `INSERT INTO water_logs (user_id, amount_ml, label, logged_at) VALUES (?, ?, ?, ?)`,
        userId,
        amount_ml,
        label,
        now(),
      );
      logId = result.lastInsertRowId;

      const today = isoDate();
      await db.runAsync(
        `INSERT INTO daily_goals (user_id, date, goal_ml, consumed_ml, streak_days, completed)
       VALUES (?, ?, 2500, ?, 0, 0)
       ON CONFLICT(user_id, date) DO UPDATE SET
         consumed_ml = consumed_ml + ?,
         completed   = CASE WHEN consumed_ml + ? >= goal_ml THEN 1 ELSE 0 END,
         updated_at  = ?`,
        userId,
        today,
        amount_ml,
        amount_ml,
        amount_ml,
        now(),
      );

      const row = await db.getFirstAsync<{ consumed_ml: number }>(
        `SELECT consumed_ml FROM daily_goals WHERE user_id = ? AND date = ?`,
        userId,
        today,
      );
      newTotal = row?.consumed_ml ?? 0;
      await db.execAsync('COMMIT');
    } catch (e) {
      await db.execAsync('ROLLBACK');
      throw e;
    }

    return { logId, newTotal };
  }

  /** All logs for a specific calendar day, newest first. */
  async getLogsForDate(userId: number, date: string): Promise<WaterLog[]> {
    return this.findAll({
      where: { clause: 'user_id = ? AND date(logged_at) = ?', args: [userId, date] },
      orderBy: { column: 'logged_at', direction: 'DESC' },
    });
  }

  /** Today's logs — convenience wrapper. */
  async getTodayLogs(userId: number): Promise<WaterLog[]> {
    return this.getLogsForDate(userId, isoDate());
  }

  /** Daily ml totals over a date range — drives the Weekly/Monthly analytics chart. */
  async getDailyTotals(user: number, fromDate: string, toDate: string): Promise<{ date: string; total_ml: number }[]> {
    const db = await this.db();
    return db.getAllAsync<{ date: string; total_ml: number }>(
      `SELECT date(logged_at) AS date, SUM(amount_ml) AS total_ml
       FROM water_logs
       WHERE user_id = ? AND date(logged_at) BETWEEN ? AND ?
       GROUP BY date(logged_at)
       ORDER BY date(logged_at) ASC`,
      user,
      fromDate,
      toDate,
    );
  }

  /** Delete a log entry and decrement the daily total atomically. */
  async deleteLog(logId: number, userId: number): Promise<void> {
    const db = await this.db();
    await db.execAsync('BEGIN');
    try {
      const log = await db.getFirstAsync<WaterLog>('SELECT * FROM water_logs WHERE id = ?', logId);
      if (!log?.logged_at) {
        await db.execAsync('COMMIT');
        return;
      }
      await db.runAsync('DELETE FROM water_logs WHERE id = ?', logId);
      await db.runAsync(
        `UPDATE daily_goals
       SET consumed_ml = MAX(0, consumed_ml - ?),
           completed   = 0,
           updated_at  = ?
       WHERE user_id = ? AND date = date(?)`,
        log.amount_ml,
        now(),
        userId,
        log.logged_at,
      );
      await db.execAsync('COMMIT');
    } catch (e) {
      await db.execAsync('ROLLBACK');
      throw e;
    }
  }
}
