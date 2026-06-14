import { BaseRepository } from '../BaseRepository';
import type { User } from '../types';
import { now } from '../utils/dateHelpers';

export class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { clause: 'email = ?', args: [email] } });
  }

  /** XP thresholds: every 500 XP = 1 level (matches "Level 12 Hydration Hero"). */
  async addXp(userId: number, xp: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;
    const newXp = user.xp + xp;
    const newLevel = Math.floor(newXp / 500) + 1;
    await this.update(userId, { xp: newXp, level: newLevel, updated_at: now() });
  }
}
