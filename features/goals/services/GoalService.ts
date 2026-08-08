import { DailyGoalRepository } from "@/db/repositories/DailyGoalRepository";

export class GoalService {
  constructor(private repository: DailyGoalRepository) {}

  async updateGoal(userId: number, goalMl: number) {
    return this.repository.setGoal(userId, goalMl);
  }
}
