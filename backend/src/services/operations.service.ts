import { OperationsRepository } from '../repositories/operations.repository';
import { CrowdRepository } from '../repositories/crowd.repository';
import { TransitRepository } from '../repositories/transit.repository';
import { IncidentRepository } from '../repositories/incident.repository';
import { AuditLogRepository } from '../repositories/auditLog.repository';
import { geminiService } from './gemini.service';
import { ValidationError } from '../middlewares/error';
import {
  StadiumVenue,
  RecommendationStatus,
  StaffType,
  AlertType,
  Priority,
  FeedbackRating,
  Role,
  IncidentStatus
} from '@prisma/client';

export class OperationsService {
  static async getRecommendations(venue: StadiumVenue) {
    return OperationsRepository.getRecommendations(venue);
  }

  static async implementRecommendation(id: string, status: RecommendationStatus, userId: string | null) {
    const rec = await OperationsRepository.findRecommendationById(id);
    if (!rec) {
      throw new ValidationError('Recommendation not found.');
    }

    const updated = await OperationsRepository.updateRecommendationStatus(id, status);

    await AuditLogRepository.log(userId, `REC_${status}`, `Recommendation ID: ${id} modified to ${status}`);

    return updated;
  }

  static async simulateScenario(scenario: string, venue: StadiumVenue, userId: string | null) {
    const telemetry = await CrowdRepository.getTelemetry(venue);
    const simulation = await geminiService.simulateScenario(scenario, venue, telemetry);

    const alert = await CrowdRepository.createAlert({
      venue,
      type: 'INCIDENT' as AlertType,
      severity: 'CRITICAL' as Priority,
      message: `SIMULATED ${scenario}: ${simulation.riskAssessment.substring(0, 100)}`,
      suggestedAction: simulation.actionPlan[0] || 'Observe evacuation guides.'
    });

    const log = await OperationsRepository.createLearningLog({
      venue,
      eventName: `SIMULATION: ${scenario}`,
      recommendation: simulation.actionPlan.join(' | '),
      humanAction: 'Implemented',
      outcome: 'Evacuation drills and response procedures validated successfully.',
      lessonsLearned: `Ensure emergency exits near ${alert.message} remain free of physical obstructions.`
    });

    await AuditLogRepository.log(userId, 'SIMULATE_SCENARIO', `Triggered simulated event: ${scenario}`);

    return {
      simulation,
      alert,
      learningLog: log
    };
  }

  static async reallocateStaff(
    venue: StadiumVenue,
    fromZone: string,
    toZone: string,
    staffType: StaffType,
    quantity: number,
    reason: string,
    userId: string | null
  ) {
    const reallocation = await OperationsRepository.createReallocation({
      venue,
      fromZone,
      toZone,
      staffType,
      quantity,
      reason
    });

    await AuditLogRepository.log(
      userId,
      'STAFF_REALLOCATION',
      `Reallocated ${quantity} ${staffType} guards from ${fromZone} to ${toZone}. Reason: ${reason}`
    );

    return reallocation;
  }

  static async aiOptimizeResources(venue: StadiumVenue) {
    const telemetry = await CrowdRepository.getTelemetry(venue);

    const currentStaff = [
      { zone: 'Gate A', volunteers: 8, security: 5, medical: 1, cleaning: 2 },
      { zone: 'Gate D', volunteers: 4, security: 4, medical: 1, cleaning: 1 },
      { zone: 'VIP Lounge', volunteers: 6, security: 3, medical: 0, cleaning: 2 },
      { zone: 'Food Court East', volunteers: 5, security: 2, medical: 1, cleaning: 4 },
      { zone: 'East Stand', volunteers: 12, security: 8, medical: 2, cleaning: 3 }
    ];

    const optimization = await geminiService.optimizeResources(venue, telemetry, currentStaff);

    const reallocations = [];
    if (optimization.reallocations && Array.isArray(optimization.reallocations)) {
      for (const item of optimization.reallocations) {
        const rec = await OperationsRepository.createReallocation({
          venue,
          fromZone: item.fromZone,
          toZone: item.toZone,
          staffType: item.staffType as StaffType,
          quantity: item.quantity,
          reason: item.reason
        });
        reallocations.push(rec);
      }
    }

    return {
      summary: optimization.summary,
      reallocations
    };
  }

  static async getBriefing(venue: StadiumVenue) {
    const telemetry = await CrowdRepository.getTelemetry(venue);
    const transit = await TransitRepository.getStatus(venue);
    const incidents = await IncidentRepository.getIncidents(venue);
    const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED' as IncidentStatus);

    return geminiService.generateOperationalBrief(venue, telemetry, transit, activeIncidents);
  }

  static async getSustainability(venue: StadiumVenue) {
    const sustainabilityLogs = await OperationsRepository.getSustainabilityMetrics(venue);
    const metrics = sustainabilityLogs[0] || null;

    const recommendations = [
      { title: 'Dim concourse lighting by 20%', savings: '120 kWh / hr', carbonReduction: '48 kg CO2', type: 'ENERGY' },
      { title: 'Increase HVAC target temperature to 24°C in suites', savings: '340 kWh / hr', carbonReduction: '136 kg CO2', type: 'ENERGY' },
      { title: 'Activate rain-water recycling filters', savings: '4000 Liters / day', carbonReduction: '8 kg CO2', type: 'WATER' }
    ];

    return {
      metrics,
      recommendations
    };
  }

  static async submitFeedback(recommendationId: string, rating: FeedbackRating, comments: string | null, userRole: Role) {
    return OperationsRepository.createFeedback({ recommendationId, userRole, rating, comments });
  }

  static async getExecutiveMetrics() {
    const incidents = await IncidentRepository.getIncidents();
    const totalIncidents = incidents.length;
    const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED' as IncidentStatus).length;
    const activeIncidents = totalIncidents - resolvedIncidents;

    const sustainabilityMetrics = await OperationsRepository.getSustainabilityMetrics();
    const totalSolarGen = sustainabilityMetrics.reduce((sum, item) => sum + item.solarGeneration, 0);

    return {
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      totalSolarGen,
      overallSafetyRating: '96.4%',
      volunteerEfficiency: '92.1%',
      overallSustainabilityScore: '89.4%'
    };
  }

  static async getLearningCenter(venue: StadiumVenue) {
    return OperationsRepository.getLearningLogs(venue);
  }
}
