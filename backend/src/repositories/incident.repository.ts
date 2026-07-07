import { prisma } from '../config/db';
import { StadiumVenue, IncidentCategory, Priority, IncidentStatus, TimelineStage } from '@prisma/client';

export class IncidentRepository {
  static async getIncidents(venue?: StadiumVenue) {
    return prisma.incident.findMany({
      where: venue ? { venue } : undefined,
      include: { timeline: { orderBy: { createdAt: 'asc' } } },
      orderBy: { reportedAt: 'desc' }
    });
  }

  static async findById(id: string) {
    return prisma.incident.findUnique({
      where: { id },
      include: { timeline: true }
    });
  }

  static async createIncident(data: {
    venue: StadiumVenue;
    category: IncidentCategory;
    severity: Priority;
    description: string;
    location: string;
  }) {
    return prisma.incident.create({
      data,
      include: { timeline: true }
    });
  }

  static async addTimeline(data: {
    incidentId: string;
    stage: TimelineStage;
    description: string;
  }) {
    return prisma.incidentTimeline.create({
      data
    });
  }

  static async updateStatus(id: string, status: IncidentStatus, resolvedAt?: Date | null) {
    return prisma.incident.update({
      where: { id },
      data: { status, resolvedAt }
    });
  }
}
