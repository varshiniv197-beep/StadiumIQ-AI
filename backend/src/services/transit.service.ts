import { TransitRepository } from '../repositories/transit.repository';
import { StadiumVenue } from '@prisma/client';

export class TransitService {
  static async getStatus(venue: StadiumVenue) {
    return TransitRepository.getStatus(venue);
  }

  static async getTravelRecommendations(venue: StadiumVenue) {
    const transitData = await TransitRepository.getStatus(venue);
    const delayedLines = transitData.filter(t => t.status !== 'ON_TIME');
    let generalRecommendation = 'All major public transit lines are operating smoothly. We recommend taking the light rail for lowest carbon footprint.';

    if (delayedLines.length > 0) {
      const linesStr = delayedLines.map(d => `${d.lineName} (${d.delayMinutes}m delay)`).join(', ');
      generalRecommendation = `Delays detected on: ${linesStr}. We recommend switching to official Shuttle Buses or scheduling a Rideshare to Lot C. Check walking paths for crowd delays.`;
    }

    return {
      recommendation: generalRecommendation,
      delayedLinesCount: delayedLines.length
    };
  }
}
