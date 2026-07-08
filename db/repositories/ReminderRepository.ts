import { BaseRepository } from '../BaseRepository';
import type { Reminder } from '../types';
import { now } from '../utils/dateHelpers';

export class ReminderRepository extends BaseRepository<Reminder> {
  protected tableName = 'reminders';

  async getForUser(userId: number): Promise<Reminder | null> {
    return this.findOne({ where: { clause: 'user_id = ?', args: [userId] } });
  }

  async saveForUser(userId: number, data: Partial<Omit<Reminder, 'id' | 'user_id'>>): Promise<void> {
    const existing = await this.getForUser(userId);

    await this.upsert(
      {
        user_id: userId,
        enabled: data.enabled ?? existing?.enabled ?? 0,
        frequency_minutes: data.frequency_minutes ?? existing?.frequency_minutes ?? 60,
        quiet_start: data.quiet_start ?? existing?.quiet_start ?? '22:00',
        quiet_end: data.quiet_end ?? existing?.quiet_end ?? '07:00',
        quiet_hours_enabled: data.quiet_hours_enabled ?? existing?.quiet_hours_enabled ?? 0,
        updated_at: now(),
      },
      ['user_id'],
    );
  }
}
