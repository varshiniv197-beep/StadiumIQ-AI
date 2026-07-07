import { CrowdRepository } from '../repositories/crowd.repository';
import { TransitRepository } from '../repositories/transit.repository';
import { geminiService } from './gemini.service';
import { StadiumVenue } from '@prisma/client';

export class CrowdService {
  static async getTelemetry(venue: StadiumVenue) {
    return CrowdRepository.getTelemetry(venue);
  }

  static async getAlerts(venue: StadiumVenue) {
    return CrowdRepository.getAlerts(venue);
  }

  static async getForecast(venue: StadiumVenue) {
    const telemetry = await CrowdRepository.getTelemetry(venue);

    // Calculate future congestion based on current states
    const forecast = telemetry.map(t => {
      const currentCongestion = t.congestionLevel;
      // Progressive forecasts
      const tenMin = Math.min(1, Math.max(0, currentCongestion + (Math.random() * 0.1 - 0.03)));
      const twentyMin = Math.min(1, Math.max(0, tenMin + (Math.random() * 0.12 - 0.04)));
      const thirtyMin = Math.min(1, Math.max(0, twentyMin + (Math.random() * 0.15 - 0.05)));
      const sixtyMin = Math.min(1, Math.max(0, thirtyMin + (Math.random() * 0.2 - 0.07)));

      return {
        zone: t.zone,
        capacityLimit: t.capacityLimit,
        current: Math.round(t.crowdCount),
        t10: Math.round(t.capacityLimit * tenMin),
        t20: Math.round(t.capacityLimit * twentyMin),
        t30: Math.round(t.capacityLimit * thirtyMin),
        t60: Math.round(t.capacityLimit * sixtyMin),
        congestionTrend: sixtyMin > currentCongestion ? 'INCREASING' : 'STABLE'
      };
    });

    return forecast;
  }

  static async explainRecommendation(advice: string, venue: StadiumVenue) {
    const telemetry = await CrowdRepository.getTelemetry(venue);
    return geminiService.explainRecommendation(advice, telemetry);
  }

  static async queryKnowledgeBase(query: string, venue: StadiumVenue) {
    const telemetry = await CrowdRepository.getTelemetry(venue);
    const transit = await TransitRepository.getStatus(venue);
    return geminiService.answerOperationsQuery(query, telemetry, transit);
  }
}
