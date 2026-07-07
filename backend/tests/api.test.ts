import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';
import { geminiService } from '../src/services/gemini.service';

// Mock authentication middleware to bypass auth logic in tests
vi.mock('../src/middlewares/auth', () => {
  return {
    authenticate: (req: any, _res: any, next: any) => {
      req.user = { id: 'test-user-id', email: 'organizer@fifa.com', role: 'ORGANIZER', name: 'Gianni Infantino' };
      next();
    },
    hasRole: (_allowedRoles: string[]) => (req: any, _res: any, next: any) => {
      next();
    }
  };
});

vi.mock('../src/utils/prisma', () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        create: vi.fn()
      },
      auditLog: {
        create: vi.fn(),
        createMany: vi.fn()
      },
      crowdTelemetry: {
        findMany: vi.fn()
      },
      transitStatus: {
        findMany: vi.fn()
      },
      incident: {
        findMany: vi.fn(),
        create: vi.fn(),
        count: vi.fn()
      },
      incidentTimeline: {
        create: vi.fn()
      },
      crowdAlert: {
        findMany: vi.fn(),
        create: vi.fn()
      },
      operationalRecommendation: {
        findMany: vi.fn()
      },
      staffReallocation: {
        create: vi.fn()
      },
      learningLog: {
        create: vi.fn()
      },
      sustainabilityMetric: {
        findFirst: vi.fn(),
        findMany: vi.fn()
      }
    }
  };
});

vi.mock('../src/services/gemini.service', () => {
  return {
    geminiService: {
      generateChatResponse: vi.fn().mockResolvedValue('Mock response from Gemini'),
      simulateScenario: vi.fn().mockResolvedValue({
        riskAssessment: 'High Risk Alert',
        actionPlan: ['Action 1', 'Action 2'],
        resourceAllocation: 'Move staff to Zone G',
        evacuationStrategy: 'Direct crowds out East exits',
        announcements: [{ language: 'English', text: 'Evacuate now' }]
      }),
      optimizeResources: vi.fn().mockResolvedValue({
        summary: 'Mock optimization summary',
        reallocations: [
          { fromZone: 'VIP Lounge', toZone: 'Gate D', staffType: 'SECURITY', quantity: 2, reason: 'Test reason' }
        ]
      }),
      generateOperationalBrief: vi.fn().mockResolvedValue('Mock operational briefing text'),
      generateAnnouncement: vi.fn().mockResolvedValue({
        script: 'Mock script',
        translation: 'Mock translation',
        audioPronunciationHint: 'Mock audio hint'
      })
    }
  };
});

describe('StadiumIQ AI Backend API Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Observability - Health Endpoint
  describe('GET /api/v1/health', () => {
    it('should return UP status and environment variables context', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'UP');
      expect(res.body).toHaveProperty('database', 'CONNECTED');
    });
  });

  // 2. Crowd Intelligence Density & Telemetry Endpoints
  describe('GET /api/v1/crowd/density', () => {
    it('should fetch crowd counts and density metrics (standard endpoint)', async () => {
      const mockData = [
        { id: '1', zone: 'Gate A', crowdCount: 1500, capacityLimit: 3000, congestionLevel: 0.5 }
      ];
      vi.mocked(prisma.crowdTelemetry.findMany).mockResolvedValue(mockData as any);

      const res = await request(app).get('/api/v1/crowd/density?venue=METLIFE_STADIUM');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.telemetry).toBeInstanceOf(Array);
      expect(res.body.telemetry[0]).toHaveProperty('zone', 'Gate A');
    });

    it('should fetch crowd counts and density metrics (alias endpoint)', async () => {
      const mockData = [
        { id: '1', zone: 'Gate A', crowdCount: 1500, capacityLimit: 3000, congestionLevel: 0.5 }
      ];
      vi.mocked(prisma.crowdTelemetry.findMany).mockResolvedValue(mockData as any);

      const res = await request(app).get('/api/v1/crowd/telemetry?venue=METLIFE_STADIUM');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.telemetry).toBeInstanceOf(Array);
      expect(res.body.telemetry[0]).toHaveProperty('zone', 'Gate A');
    });
  });

  // 3. Transit & Parking telemetry
  describe('GET /api/v1/transit/status', () => {
    it('should return transit lines status', async () => {
      const mockTransit = [
        { id: '1', transportType: 'METRO', lineName: 'Expo Line Line', status: 'ON_TIME', occupancyPercentage: 65 }
      ];
      vi.mocked(prisma.transitStatus.findMany).mockResolvedValue(mockTransit as any);

      const res = await request(app).get('/api/v1/transit/status?venue=METLIFE_STADIUM');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.transit[0]).toHaveProperty('lineName', 'Expo Line Line');
    });
  });

  // 4. Transit delay recommendations
  describe('GET /api/v1/transit/recommendations', () => {
    it('should calculate transport recommendations based on delays', async () => {
      const mockTransit = [
        { id: '1', transportType: 'METRO', lineName: 'Red Line', status: 'DELAYED', delayMinutes: 10, occupancyPercentage: 70 }
      ];
      vi.mocked(prisma.transitStatus.findMany).mockResolvedValue(mockTransit as any);

      const res = await request(app).get('/api/v1/transit/recommendations?venue=METLIFE_STADIUM');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.recommendation).toContain('Red Line');
    });
  });

  // 5. Gemini GenAI Namespaced assistant chat
  describe('POST /api/v1/gemini/chat', () => {
    it('should query the multilingual Gemini chatbot assistant', async () => {
      const res = await request(app)
        .post('/api/v1/gemini/chat')
        .send({
          message: 'How do I get to Gate A?',
          history: [],
          language: 'Spanish'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.response).toBe('Mock response from Gemini');
      expect(geminiService.generateChatResponse).toHaveBeenCalledWith(
        'How do I get to Gate A?',
        [],
        'Spanish'
      );
    });
  });

  // 6. Gemini Scenario simulation
  describe('POST /api/v1/gemini/simulation', () => {
    it('should trigger emergency simulation with Gemini analysis', async () => {
      vi.mocked(prisma.crowdTelemetry.findMany).mockResolvedValue([]);
      vi.mocked(prisma.crowdAlert.create).mockResolvedValue({ id: 'alert-1' } as any);
      vi.mocked(prisma.learningLog.create).mockResolvedValue({ id: 'log-1' } as any);

      const res = await request(app)
        .post('/api/v1/gemini/simulation')
        .send({
          scenario: 'FIRE_ALERT',
          venue: 'METLIFE_STADIUM'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('simulation');
      expect(res.body.simulation.riskAssessment).toBe('High Risk Alert');
      expect(geminiService.simulateScenario).toHaveBeenCalled();
    });
  });

  // 7. Gemini Resource Optimization Reallocator
  describe('POST /api/v1/gemini/resource-optimize', () => {
    it('should calculate resource reallocations using Gemini', async () => {
      vi.mocked(prisma.crowdTelemetry.findMany).mockResolvedValue([]);
      vi.mocked(prisma.staffReallocation.create).mockResolvedValue({ id: 'realloc-1' } as any);

      const res = await request(app)
        .post('/api/v1/gemini/resource-optimize')
        .send({
          venue: 'METLIFE_STADIUM'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.summary).toBe('Mock optimization summary');
      expect(res.body.reallocations).toBeInstanceOf(Array);
    });
  });

  // 8. Gemini Operational Briefing
  describe('GET /api/v1/gemini/briefing', () => {
    it('should output operational briefing from Gemini', async () => {
      vi.mocked(prisma.crowdTelemetry.findMany).mockResolvedValue([]);
      vi.mocked(prisma.transitStatus.findMany).mockResolvedValue([]);
      vi.mocked(prisma.incident.findMany).mockResolvedValue([]);

      const res = await request(app).get('/api/v1/gemini/briefing?venue=METLIFE_STADIUM');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.brief).toBe('Mock operational briefing text');
    });
  });

  // 9. Gemini announcement generation
  describe('POST /api/v1/gemini/announcement', () => {
    it('should generate emergency voice announcement details', async () => {
      const res = await request(app)
        .post('/api/v1/gemini/announcement')
        .send({
          category: 'WEATHER_DELAY',
          details: 'Heavy downpour on east corridor',
          targetLanguage: 'Spanish'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.script).toBe('Mock script');
    });
  });

  // 10. Sustainability Metric
  describe('GET /api/v1/sustainability', () => {
    it('should fetch sustainability metrics', async () => {
      vi.mocked(prisma.sustainabilityMetric.findFirst).mockResolvedValue({
        id: '1',
        energyKWh: 5000,
        waterLiters: 10000,
        wasteKg: 1000,
        recyclingPercent: 75,
        carbonKg: 2000,
        solarGeneration: 1500,
        foodWasteKg: 200,
        timestamp: new Date()
      } as any);

      const res = await request(app).get('/api/v1/sustainability?venue=METLIFE_STADIUM');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.metrics).toHaveProperty('energyKWh', 5000);
    });
  });
});
