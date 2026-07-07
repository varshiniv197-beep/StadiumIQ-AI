import { prisma } from '../config/db';
import { StadiumVenue, AlertType, Priority } from '@prisma/client';

export class CrowdRepository {
  static async getTelemetry(venue?: StadiumVenue) {
    return prisma.crowdTelemetry.findMany({
      where: venue ? { venue } : undefined,
      orderBy: { timestamp: 'desc' }
    });
  }

  static async getAlerts(venue?: StadiumVenue) {
    return prisma.crowdAlert.findMany({
      where: venue ? { venue } : undefined,
      orderBy: { timestamp: 'desc' }
    });
  }

  static async createTelemetry(data: {
    venue: StadiumVenue;
    zone: string;
    crowdCount: number;
    capacityLimit: number;
    queueLength: number;
    avgWaitTimeSeconds: number;
    congestionLevel: number;
    riskZone: boolean;
  }) {
    return prisma.crowdTelemetry.create({ data });
  }

  static async createAlert(data: {
    venue: StadiumVenue;
    type: AlertType;
    severity: Priority;
    message: string;
    suggestedAction: string;
  }) {
    return prisma.crowdAlert.create({ data });
  }
}
