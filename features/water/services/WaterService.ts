import { WaterLogRepository } from "../repositories/WaterLogRepository";

export class WaterService {
  constructor(private repository: WaterLogRepository) {}

  async addDrink(userId: number, amount_ml: number, label = "Water") {
    const result = await this.repository.logDrink(userId, amount_ml, label);

    const logs = await this.repository.getTodayLogs(userId);

    return {
      ...result,
      logs,
    };
  }
}
