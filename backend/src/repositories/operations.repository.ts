import { prisma } from '../config/db';
import {
  StadiumVenue,
  RecommendationCategory,
  RecommendationStatus,
  StaffType,
  FeedbackRating,
  Role
} from '@prisma/client';

export class OperationsRepository {
  static async getRecommendations(venue?: StadiumVenue) {
    return prisma.operationalRecommendation.findMany({
      where: venue ? { venue } : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findRecommendationById(id: string) {
    return prisma.operationalRecommendation.findUnique({
      where: { id }
    });
  }

  static async updateRecommendationStatus(id: string, status: RecommendationStatus) {
    return prisma.operationalRecommendation.update({
      where: { id },
      data: { status }
    });
  }

  static async createRecommendation(data: {
    venue: StadiumVenue;
    category: RecommendationCategory;
    advice: string;
    reasoning: string;
    confidence: number;
    expectedImprovement: string;
  }) {
    return prisma.operationalRecommendation.create({ data });
  }

  static async getSustainabilityMetrics(venue?: StadiumVenue) {
    return prisma.sustainabilityMetric.findMany({
      where: venue ? { venue } : undefined,
      orderBy: { timestamp: 'desc' }
    });
  }

  static async createSustainabilityMetric(data: {
    venue: StadiumVenue;
    energyKWh: number;
    waterLiters: number;
    wasteKg: number;
    recyclingPercent: number;
    carbonKg: number;
    solarGeneration?: number;
    foodWasteKg?: number;
  }) {
    return prisma.sustainabilityMetric.create({ data });
  }

  static async getReallocations(venue?: StadiumVenue) {
    return prisma.staffReallocation.findMany({
      where: venue ? { venue } : undefined,
      orderBy: { timestamp: 'desc' }
    });
  }

  static async createReallocation(data: {
    venue: StadiumVenue;
    fromZone: string;
    toZone: string;
    staffType: StaffType;
    quantity: number;
    reason: string;
  }) {
    return prisma.staffReallocation.create({ data });
  }

  static async createFeedback(data: {
    recommendationId: string;
    userRole: Role;
    rating: FeedbackRating;
    comments?: string | null;
  }) {
    return prisma.aIFeedback.create({ data });
  }

  static async getLearningLogs(venue?: StadiumVenue) {
    return prisma.learningLog.findMany({
      where: venue ? { venue } : undefined,
      orderBy: { timestamp: 'desc' }
    });
  }

  static async createLearningLog(data: {
    venue: StadiumVenue;
    eventName: string;
    recommendation: string;
    humanAction: string;
    outcome: string;
    lessonsLearned: string;
  }) {
    return prisma.learningLog.create({ data });
  }
}
