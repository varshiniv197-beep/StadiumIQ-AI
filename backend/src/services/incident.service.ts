import { IncidentRepository } from '../repositories/incident.repository';
import { CrowdRepository } from '../repositories/crowd.repository';
import { AuditLogRepository } from '../repositories/auditLog.repository';
import { OperationsRepository } from '../repositories/operations.repository';
import { geminiService } from './gemini.service';
import { ValidationError } from '../middlewares/error';
import { StadiumVenue, IncidentCategory, Priority, IncidentStatus, TimelineStage } from '@prisma/client';

export class IncidentService {
  static async getIncidents(venue: StadiumVenue) {
    return IncidentRepository.getIncidents(venue);
  }

  static async createIncident(
    venue: StadiumVenue,
    category: IncidentCategory,
    severity: Priority,
    description: string,
    location: string,
    userId: string | null
  ) {
    const newIncident = await IncidentRepository.createIncident({
      venue,
      category,
      severity,
      description,
      location
    });

    await IncidentRepository.addTimeline({
      incidentId: newIncident.id,
      stage: 'REPORTED',
      description: `Emergency incident of type ${category} registered at ${location}.`
    });

    await AuditLogRepository.log(
      userId,
      'EMERGENCY_TRIGGERED',
      `Incident category ${category} reported at ${location} (${severity} severity)`
    );

    const telemetry = await CrowdRepository.getTelemetry(venue);
    const aiPlan = await geminiService.simulateScenario(`${category}: ${description}`, venue, telemetry);

    return {
      incident: newIncident,
      aiPlan
    };
  }

  static async addTimelineEntry(
    id: string,
    stage: TimelineStage,
    description: string
  ) {
    const incident = await IncidentRepository.findById(id);
    if (!incident) {
      throw new ValidationError('Incident not found.');
    }

    const timelineItem = await IncidentRepository.addTimeline({
      incidentId: id,
      stage,
      description
    });

    let finalStatus = incident.status;
    if (stage === 'RESOLVED') {
      finalStatus = 'RESOLVED';
    } else if (stage === 'RESPONDING') {
      finalStatus = 'RESPONDING';
    } else if (stage === 'DISPATCHED') {
      finalStatus = 'DISPATCHED';
    }

    await IncidentRepository.updateStatus(
      id,
      finalStatus as IncidentStatus,
      stage === 'RESOLVED' ? new Date() : incident.resolvedAt
    );

    if (stage === 'RESOLVED') {
      await OperationsRepository.createLearningLog({
        venue: incident.venue,
        eventName: `Incident ID: ${incident.id.substring(0, 8)} (${incident.category})`,
        recommendation: `Deploy security personnel to ${incident.location}`,
        humanAction: 'Implemented',
        outcome: 'Incident resolved with minimal corridor disruptions.',
        lessonsLearned: `Review dispatch latencies for ${incident.category} in ${incident.location}. Add local signs.`
      });
    }

    return timelineItem;
  }
}
