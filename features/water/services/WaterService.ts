import { WaterLogRepository } from "../repositories/WaterLogRepository";

export class WaterService {
  constructor(private repository: WaterLogRepository) {}

  async addDrink(userId: number, amountMl: number, label = "Water") {
    const result = await this.repository.logDrink(userId, amountMl, label);

    const logs = await this.repository.getTodayLogs(userId);

    return {
      ...result,
      logs,
    };
  }

  async deleteDrink(logId: number, userId: number) {
    await this.repository.deleteLog(logId, userId);

    return this.repository.getTodayLogs(userId);
  }
}
