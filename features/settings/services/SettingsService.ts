import { ReminderRepository } from "@/db/repositories/ReminderRepository";
import { SettingsRepository } from "@/db/repositories/SettingsRepository";

export class SettingsService {
  constructor(
    private settingsRepository: SettingsRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async getSettings(userId: number) {
    const settings = await this.settingsRepository.getForUser(userId);

    const reminders = await this.reminderRepository.getForUser(userId);

    return {
      settings,
      reminders,
    };
  }

  async saveDefaultQuickAdd(userId: number, amount: number) {
    return this.settingsRepository.saveForUser(userId, {
      default_quick_add_ml: amount,
    });
  }

  async saveSound(userId: number, enabled: boolean) {
    return this.settingsRepository.saveForUser(userId, {
      sound: enabled ? 1 : 0,
    });
  }
}
