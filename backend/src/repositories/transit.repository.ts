import { prisma } from '../config/db';
import { StadiumVenue, TransportType, TransitStatusEnum } from '@prisma/client';

export class TransitRepository {
  static async getStatus(venue?: StadiumVenue) {
    return prisma.transitStatus.findMany({
      where: venue ? { venue } : undefined,
      orderBy: { timestamp: 'desc' }
    });
  }

  static async createStatus(data: {
    venue: StadiumVenue;
    transportType: TransportType;
    lineName: string;
    status: TransitStatusEnum;
    delayMinutes: number;
    occupancyPercentage: number;
    parkingOccupancy?: number | null;
  }) {
    return prisma.transitStatus.create({ data });
  }
}
