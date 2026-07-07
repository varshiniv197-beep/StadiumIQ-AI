import { 
  PrismaClient, 
  Role, 
  StadiumVenue, 
  TransportType, 
  TransitStatusEnum, 
  IncidentCategory, 
  Priority, 
  IncidentStatus, 
  TimelineStage, 
  TaskStatus, 
  AlertType, 
  RecommendationCategory, 
  RecommendationStatus 
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding StadiumIQ AI database...');

  // 1. Clean existing records
  await prisma.auditLog.deleteMany({});
  await prisma.aIFeedback.deleteMany({});
  await prisma.learningLog.deleteMany({});
  await prisma.staffReallocation.deleteMany({});
  await prisma.operationalRecommendation.deleteMany({});
  await prisma.crowdAlert.deleteMany({});
  await prisma.volunteerTask.deleteMany({});
  await prisma.incidentTimeline.deleteMany({});
  await prisma.incident.deleteMany({});
  await prisma.sustainabilityMetric.deleteMany({});
  await prisma.transitStatus.deleteMany({});
  await prisma.crowdTelemetry.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users (with role-based access)
  const passwordHash = await bcrypt.hash('FIFA2026SecurePass!', 10);

  const users = [
    { email: 'organizer@fifa.com', name: 'Gianni Infantino', role: 'ORGANIZER' },
    { email: 'volunteer@fifa.com', name: 'Sofia Rodriguez', role: 'VOLUNTEER' },
    { email: 'security@fifa.com', name: 'John Miller', role: 'SECURITY_OFFICER' },
    { email: 'staff@fifa.com', name: 'Kenji Sato', role: 'VENUE_STAFF' },
    { email: 'transport@fifa.com', name: 'Amara Diop', role: 'TRANSPORT_COORDINATOR' },
    { email: 'green@fifa.com', name: 'Elena Petrova', role: 'SUSTAINABILITY_MANAGER' },
    { email: 'fan@fifa.com', name: 'Carlos Gomez', role: 'FAN' }
  ];

  const dbUsers = [];
  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role as Role
      }
    });
    dbUsers.push(user);
  }
  console.log(`Created ${dbUsers.length} users with distinct roles.`);

  // 3. Seed CrowdTelemetry (across 3 stadiums)
  const venues = ['METLIFE_STADIUM', 'ESTADIO_AZTECA', 'BC_PLACE'];
  const zones = ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'North Concourse', 'South Concourse', 'East Stand', 'West Stand', 'VIP Lounge', 'Food Court East', 'Food Court West'];

  for (const venue of venues) {
    for (const zone of zones) {
      let count = 0;
      let limit = 5000;
      let queue = 0;
      let wait = 0;

      if (zone.startsWith('Gate')) {
        count = Math.floor(Math.random() * 2500) + 500;
        limit = 3000;
        queue = Math.floor(count / 15);
        wait = Math.floor(queue * 4.5);
      } else if (zone.includes('Concourse')) {
        count = Math.floor(Math.random() * 4000) + 1000;
        limit = 6000;
        queue = Math.floor(count / 40);
        wait = Math.floor(queue * 1.5);
      } else if (zone.includes('Stand')) {
        count = Math.floor(Math.random() * 15000) + 5000;
        limit = 20000;
      } else {
        count = Math.floor(Math.random() * 1000) + 100;
        limit = 1500;
        queue = Math.floor(count / 20);
        wait = Math.floor(queue * 3);
      }

      const congestion = Number((count / limit).toFixed(2));
      const risk = congestion > 0.85;

      await prisma.crowdTelemetry.create({
        data: {
          venue: venue as StadiumVenue,
          zone,
          crowdCount: count,
          capacityLimit: limit,
          queueLength: queue,
          avgWaitTimeSeconds: wait,
          congestionLevel: congestion,
          riskZone: risk
        }
      });
    }
  }
  console.log('Seeded crowd telemetry across all venues.');

  // 4. Seed TransitStatus
  const transitTypes = ['METRO', 'BUS', 'TAXI', 'RIDESHARE'];
  for (const venue of venues) {
    for (const type of transitTypes) {
      let line = '';
      let status = 'ON_TIME';
      let delay = 0;
      let occupancy = Math.floor(Math.random() * 50) + 30;
      let parking = null;

      if (type === 'METRO') {
        line = venue === 'METLIFE_STADIUM' ? 'Meadowlands Rail' : venue === 'ESTADIO_AZTECA' ? 'Light Rail Line 1' : 'Expo Line Metro';
        status = Math.random() > 0.8 ? 'DELAYED' : 'ON_TIME';
        delay = status === 'DELAYED' ? Math.floor(Math.random() * 15) + 5 : 0;
        occupancy = Math.floor(Math.random() * 40) + 50;
      } else if (type === 'BUS') {
        line = 'FIFA Shuttle Service Express';
        status = Math.random() > 0.9 ? 'DELAYED' : 'ON_TIME';
        delay = status === 'DELAYED' ? Math.floor(Math.random() * 10) + 2 : 0;
      } else if (type === 'TAXI') {
        line = 'Official Taxi Stand Zone 1-4';
        occupancy = Math.floor(Math.random() * 20) + 10;
      } else {
        line = 'Uber/Lyft Designated Area';
        occupancy = Math.floor(Math.random() * 30) + 10;
      }

      if (type === 'RIDESHARE') {
        parking = Math.floor(Math.random() * 400) + 50; // Available spots
      }

      await prisma.transitStatus.create({
        data: {
          venue: venue as StadiumVenue,
          transportType: type as TransportType,
          lineName: line,
          status: status as TransitStatusEnum,
          delayMinutes: delay,
          occupancyPercentage: occupancy,
          parkingOccupancy: parking
        }
      });
    }
  }
  console.log('Seeded transportation and parking status.');

  // 5. Seed SustainabilityMetric
  for (const venue of venues) {
    await prisma.sustainabilityMetric.create({
      data: {
        venue: venue as StadiumVenue,
        energyKWh: Math.random() * 8000 + 4000,
        waterLiters: Math.random() * 50000 + 20000,
        wasteKg: Math.random() * 2000 + 500,
        recyclingPercent: Math.random() * 30 + 65, // 65% to 95%
        carbonKg: Math.random() * 4000 + 1000,
        solarGeneration: Math.random() * 3000 + 1000,
        foodWasteKg: Math.random() * 500 + 100
      }
    });
  }
  console.log('Seeded sustainability metrics.');

  // 6. Seed Incidents and Timelines
  const incidentData = [
    {
      venue: 'METLIFE_STADIUM',
      category: 'MEDICAL',
      severity: 'HIGH',
      description: 'Fan collapsed in Section 112 due to heat exhaustion.',
      status: 'RESPONDING',
      location: 'Section 112 / East Stand',
      timeline: [
        { stage: 'REPORTED', description: 'Incident reported by Fan via app.' },
        { stage: 'DISPATCHED', description: 'Volunteer dispatched with water and medical bag.' },
        { stage: 'RESPONDING', description: 'Medical Response Team 2 en route with stretcher.' }
      ]
    },
    {
      venue: 'METLIFE_STADIUM',
      category: 'PANIC',
      severity: 'CRITICAL',
      description: 'Minor congestion bottleneck at Gate D causing push-back.',
      status: 'DISPATCHED',
      location: 'Gate D Plaza',
      timeline: [
        { stage: 'REPORTED', description: 'Gate D density sensor flagged 92% capacity threshold.' },
        { stage: 'DISPATCHED', description: '4 Security officers and 3 volunteers dispatched to redirect crowd.' }
      ]
    },
    {
      venue: 'ESTADIO_AZTECA',
      category: 'LOST_CHILD',
      severity: 'MEDIUM',
      description: '7-year-old child separated from parents near Food Court West.',
      status: 'RESOLVED',
      location: 'Food Court West',
      timeline: [
        { stage: 'REPORTED', description: 'Mother alerted operations kiosk.' },
        { stage: 'DISPATCHED', description: 'Broadcast sent to all Zone 4 volunteers.' },
        { stage: 'RESPONDING', description: 'Child found by Volunteer Sofia Rodriguez.' },
        { stage: 'RESOLVED', description: 'Child reunited with family at Kiosk B. Incident closed.' }
      ]
    }
  ];

  for (const inc of incidentData) {
    const createdIncident = await prisma.incident.create({
      data: {
        venue: inc.venue as StadiumVenue,
        category: inc.category as IncidentCategory,
        severity: inc.severity as Priority,
        description: inc.description,
        status: inc.status as IncidentStatus,
        location: inc.location
      }
    });

    for (const t of inc.timeline) {
      await prisma.incidentTimeline.create({
        data: {
          incidentId: createdIncident.id,
          stage: t.stage as TimelineStage,
          description: t.description
        }
      });
    }
  }
  console.log('Seeded incidents with chronological timelines.');

  // 7. Seed Volunteer Tasks
  const tasks = [
    { title: 'Assist Mobility Passengers', description: 'Help disabled guests navigate from Gate B elevator to East VIP deck.', priority: 'HIGH', status: 'OPEN' },
    { title: 'Restock Water Stations', description: 'Transport water boxes from Main Storage to Level 2 Concourse stations.', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { title: 'Translate Public Announcement', description: 'Translate sudden weather delay announcements into Spanish and Portuguese.', priority: 'HIGH', status: 'COMPLETED' },
    { title: 'Distribute Recycling Bags', description: 'Distribute standard biodegradable bins to concessions at Food Court East.', priority: 'LOW', status: 'OPEN' }
  ];

  for (const t of tasks) {
    await prisma.volunteerTask.create({
      data: {
        title: t.title,
        description: t.description,
        priority: t.priority as Priority,
        status: t.status as TaskStatus,
        assigneeId: t.status !== 'OPEN' ? dbUsers[1].id : null // Assign to volunteer user
      }
    });
  }
  console.log('Seeded volunteer tasks.');

  // 8. Seed Crowd Alerts
  await prisma.crowdAlert.createMany({
    data: [
      {
        venue: 'METLIFE_STADIUM' as StadiumVenue,
        type: 'BOTTLENECK' as AlertType,
        severity: 'HIGH' as Priority,
        message: 'Gate D queuing wait times have reached 35 minutes.',
        suggestedAction: 'Open Gate B relief lanes and dispatch Zone A volunteers.'
      },
      {
        venue: 'METLIFE_STADIUM' as StadiumVenue,
        type: 'WEATHER' as AlertType,
        severity: 'MEDIUM' as Priority,
        message: 'Heavy rain forecasted starting in 45 minutes.',
        suggestedAction: 'Advise fans via app to seek concourse shelter; increase metro rail service.'
      },
      {
        venue: 'ESTADIO_AZTECA' as StadiumVenue,
        type: 'OVERCROWDING' as AlertType,
        severity: 'CRITICAL' as Priority,
        message: 'Concourse North congestion level exceeds 90% limit.',
        suggestedAction: 'Deploy security guards to enforce unidirectional traffic flow.'
      }
    ]
  });
  console.log('Seeded crowd safety alerts.');

  // 9. Seed Operational Recommendations (Explainable AI format)
  await prisma.operationalRecommendation.createMany({
    data: [
      {
        venue: 'METLIFE_STADIUM' as StadiumVenue,
        category: 'LOGISTICS' as RecommendationCategory,
        advice: 'Deploy 4 additional volunteers to Gate D security scanning lanes.',
        reasoning: 'Gate D wait times are spiking due to high flow from Meadowlands Metro. Average wait has increased from 12m to 35m in the last 15 minutes.',
        confidence: 94,
        expectedImprovement: 'Reduce Gate D queues by 18% and cut average wait times by 6 minutes.',
        status: 'OPEN' as RecommendationStatus
      },
      {
        venue: 'METLIFE_STADIUM' as StadiumVenue,
        category: 'SECURITY' as RecommendationCategory,
        advice: 'Open Gate B backup gates to relieve incoming crowding pressure.',
        reasoning: 'Combined entry load across Gate A and D exceeds total safe processing rates by 1200 fans/hour. Historical models recommend secondary gate opening.',
        confidence: 89,
        expectedImprovement: 'Improve entry throughput by 22% and prevent stampede risk.',
        status: 'OPEN' as RecommendationStatus
      },
      {
        venue: 'METLIFE_STADIUM' as StadiumVenue,
        category: 'MEDICAL' as RecommendationCategory,
        advice: 'Establish a temporary hydration booth in South Concourse.',
        reasoning: 'Current ambient temperature is 32°C. Section 112 medical logs report 3 heat exhaustions. Humidity levels are rising.',
        confidence: 91,
        expectedImprovement: 'Prevent medical incidence spike and reduce dehydration reports by 40%.',
        status: 'OPEN' as RecommendationStatus
      }
    ]
  });
  console.log('Seeded explainable AI operational recommendations.');

  // 10. Audit log entries
  await prisma.auditLog.createMany({
    data: [
      { action: 'USER_LOGIN', details: 'Gianni Infantino (ORGANIZER) logged into the platform.' },
      { action: 'RECOMMENDATION_STATUS_CHANGE', details: 'Recommendation ID 1 status modified from OPEN to IMPLEMENTED.' },
      { action: 'EMERGENCY_TRIGGERED', details: 'Medical alert triggered at Section 112 / East Stand.' }
    ]
  });
  console.log('Seeded audit logs.');

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
