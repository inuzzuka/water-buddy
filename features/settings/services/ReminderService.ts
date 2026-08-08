import { ReminderRepository } from "@/db/repositories/ReminderRepository";

export class ReminderService {
  constructor(private repository: ReminderRepository) {}

  async saveReminder(
    userId: number,
    enabled: boolean,
    frequencyMinutes: number,
  ) {
    return this.repository.saveForUser(userId, {
      enabled: enabled ? 1 : 0,
      frequency_minutes: frequencyMinutes,
    });
  }

  async saveQuietHours(
    userId: number,
    enabled: boolean,
    start: string,
    end: string,
  ) {
    return this.repository.saveForUser(userId, {
      quiet_hours_enabled: enabled ? 1 : 0,
      quiet_start: start,
      quiet_end: end,
    });
  }

  async getReminder(userId: number) {
    return this.repository.getForUser(userId);
  }
}
