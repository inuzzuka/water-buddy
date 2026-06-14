import { BaseRepository } from '../BaseRepository';
import type { AppSettings } from '../types';
import { now } from '../utils/dateHelpers';

export class SettingsRepository extends BaseRepository<AppSettings> {
  protected tableName = 'settings';

  async getForUser(userId: number): Promise<AppSettings | null> {
    return this.findOne({ where: { clause: 'user_id = ?', args: [userId] } });
  }

  async saveForUser(userId: number, data: Partial<Omit<AppSettings, 'id' | 'user_id'>>): Promise<void> {
    await this.upsert(
      {
        user_id: userId,
        dark_mode: data.dark_mode ?? 0,
        sound: data.sound ?? 1,
        updated_at: now(),
      },
      ['user_id'],
    );
  }
}
