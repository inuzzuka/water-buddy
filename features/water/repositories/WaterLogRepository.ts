import { BaseRepository } from "@/db/BaseRepository";
import type { DailyWaterTotal, WaterLog } from "@/db/types";
import { isoDate, now } from "@/db/utils/dateHelpers";

export class WaterLogRepository extends BaseRepository<WaterLog> {
  protected tableName = "water_logs";

  /**
   * Creates a new water log entry.
   * The daily consumed amount is calculated from water_logs,
   * so no daily_goals update is needed here.
   */
  async logDrink(
    userId: number,
    amount_ml: number,
    label: string = "Water",
  ): Promise<{ logId: number; newTotal: number }> {
    const db = await this.db();

    const result = await db.runAsync(
      `
      INSERT INTO water_logs 
        (user_id, amount_ml, label, logged_at)
      VALUES (?, ?, ?, ?)
      `,
      userId,
      amount_ml,
      label,
      now(),
    );

    const newTotal = await this.getTodayTotal(userId);

    return {
      logId: result.lastInsertRowId,
      newTotal,
    };
  }

  /** All logs for a specific calendar day, newest first. */
  async getLogsForDate(userId: number, date: string): Promise<WaterLog[]> {
    return this.findAll({
      where: {
        clause: "user_id = ? AND date(logged_at) = ?",
        args: [userId, date],
      },
      orderBy: {
        column: "logged_at",
        direction: "DESC",
      },
    });
  }

  /** Today's logs — convenience wrapper. */
  async getTodayLogs(userId: number): Promise<WaterLog[]> {
    return this.getLogsForDate(userId, isoDate());
  }

  /**
   * Returns total water consumed today.
   * Source of truth for progress UI.
   */
  async getTodayTotal(userId: number): Promise<number> {
    const db = await this.db();

    const result = await db.getFirstAsync<{ total: number }>(
      `
      SELECT COALESCE(SUM(amount_ml), 0) AS total
      FROM water_logs
      WHERE user_id = ?
      AND date(logged_at) = date('now')
      `,
      userId,
    );

    return result?.total ?? 0;
  }

  /**
   * Daily totals over a date range.
   * Used by Weekly/Monthly charts.
   */
  async getDailyTotals(
    userId: number,
    fromDate: string,
    toDate: string,
  ): Promise<DailyWaterTotal[]> {
    const db = await this.db();

    return db.getAllAsync<{ date: string; total_ml: number }>(
      `
      SELECT 
        date(logged_at) AS date,
        SUM(amount_ml) AS total_ml
      FROM water_logs
      WHERE user_id = ?
      AND date(logged_at) BETWEEN ? AND ?
      GROUP BY date(logged_at)
      ORDER BY date(logged_at) ASC
      `,
      userId,
      fromDate,
      toDate,
    );
  }

  /**
   * Deletes a water log entry.
   * Progress updates automatically because it is calculated
   * from remaining water_logs.
   */
  async deleteLog(logId: number, userId: number): Promise<void> {
    const db = await this.db();

    await db.runAsync(
      `
      DELETE FROM water_logs
      WHERE id = ?
      AND user_id = ?
      `,
      logId,
      userId,
    );
  }
}
