import { WaterLogRepository } from "../repositories/WaterLogRepository";
import { WaterService } from "./WaterService";

const waterRepository = new WaterLogRepository();

export const waterService = new WaterService(waterRepository);
