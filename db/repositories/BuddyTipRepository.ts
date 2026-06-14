import { BaseRepository } from '../BaseRepository';
import type { BuddyTip } from '../types';
import { now } from '../utils/dateHelpers';

export class BuddyTipRepository extends BaseRepository<BuddyTip> {
  protected tableName = 'buddy_tips';

  /** Returns the oldest unseen tip; falls back to least-recently-shown if all seen. */
  async getNextTip(userId: number): Promise<BuddyTip | null> {
    const unseen = await this.findOne({
      where: { clause: 'user_id = ? AND shown_at IS NULL', args: [userId] },
      orderBy: { column: 'created_at', direction: 'ASC' },
    });

    if (unseen) {
      await this.update(unseen.id!, { shown_at: now() });
      return unseen;
    }

    // All tips seen — cycle from the least recently shown
    return this.findOne({
      where: { clause: 'user_id = ?', args: [userId] },
      orderBy: { column: 'shown_at', direction: 'ASC' },
    });
  }

  /** Seeds default tips on first login. No-op if tips already exist. */
  async seedDefaultTips(userId: number): Promise<void> {
    const existing = await this.count({ clause: 'user_id = ?', args: [userId] });
    if (existing > 0) return;

    const tips = [
      'Drinking a full glass right when you wake up is a great way to kickstart your metabolism.',
      "I've noticed you're most active in the mornings! Try to sip steadily throughout the day.",
      "Staying hydrated improves focus and energy. You're doing great — keep it up!",
      'A good habit: drink a glass of water before every meal. It helps digestion too!',
      "You're on a streak! Consistency is the secret to long-term hydration health.",
    ];

    for (const content of tips) {
      await this.insert({ user_id: userId, content });
    }
  }
}
