import { Router } from 'express';
import { AuthController, signupSchema, loginSchema } from '../controllers/auth.controller';
import { CrowdController, explainSchema, kbSchema } from '../controllers/crowd.controller';
import { TransitController } from '../controllers/transit.controller';
import { IncidentController, createIncidentSchema, updateTimelineSchema } from '../controllers/incidents.controller';
import { VolunteerController, createTaskSchema, updateTaskSchema } from '../controllers/volunteers.controller';
import { OperationsController, simulateSchema, reallocateSchema, feedbackSchema } from '../controllers/operations.controller';
import { AnnouncementController, announcementSchema } from '../controllers/announcement.controller';
import { GeminiController, chatSchema } from '../controllers/gemini.controller';
import { authenticate, hasRole } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

const router = Router();

// ==========================================
// 1. Authentication Routes
// ==========================================
router.post('/auth/signup', validate(signupSchema), AuthController.signup);
router.post('/auth/login', validate(loginSchema), AuthController.login);
router.get('/auth/profile', authenticate, AuthController.getProfile);

// ==========================================
// 2. Gemini AI Namespaced Routes
// ==========================================
router.post('/gemini/chat', validate(chatSchema), GeminiController.chat);
router.post('/gemini/simulation', authenticate, hasRole(['ORGANIZER', 'SECURITY_OFFICER']), validate(simulateSchema), OperationsController.simulateScenario);
router.post('/gemini/resource-optimize', authenticate, hasRole(['ORGANIZER']), OperationsController.aiOptimizeResources);
router.get('/gemini/briefing', OperationsController.getBriefing);
router.post('/gemini/announcement', authenticate, validate(announcementSchema), AnnouncementController.generate);

// ==========================================
// 3. Crowd Intelligence Routes
// ==========================================
router.get('/crowd/density', CrowdController.getTelemetry);
router.get('/crowd/telemetry', CrowdController.getTelemetry); // Alias for compatibility
router.get('/crowd/alerts', CrowdController.getAlerts);
router.get('/crowd/forecast', CrowdController.getForecast);
router.post('/crowd/explain-recommendation', validate(explainSchema), CrowdController.explainRecommendation);
router.post('/crowd/knowledge-base', validate(kbSchema), CrowdController.queryKnowledgeBase);

// ==========================================
// 4. Transit & Parking Routes
// ==========================================
router.get('/transit/status', TransitController.getStatus);
router.get('/transit/recommendations', TransitController.getTravelRecommendations);

// ==========================================
// 5. Incident Management Routes
// ==========================================
router.get('/incidents', IncidentController.getIncidents);
router.post('/incidents', authenticate, validate(createIncidentSchema), IncidentController.createIncident);
router.post('/incidents/:id/timeline', authenticate, validate(updateTimelineSchema), IncidentController.addTimelineEntry);

// ==========================================
// 6. Volunteer Portal Routes
// ==========================================
router.get('/volunteers/tasks', VolunteerController.getTasks);
router.post('/volunteers/tasks', authenticate, validate(createTaskSchema), VolunteerController.createTask);
router.put('/volunteers/tasks/:id', authenticate, validate(updateTaskSchema), VolunteerController.updateTask);
router.get('/volunteers/locations', authenticate, VolunteerController.getVolunteerLocations);

// ==========================================
// 7. Operations Control Center General Routes
// ==========================================
router.get('/operations/recommendations', OperationsController.getRecommendations);
router.post('/operations/recommendations/:id/action', authenticate, OperationsController.implementRecommendation);
router.post('/operations/reallocate', authenticate, validate(reallocateSchema), OperationsController.reallocateStaff);
router.get('/operations/sustainability', OperationsController.getSustainability);
router.post('/operations/feedback', authenticate, validate(feedbackSchema), OperationsController.submitFeedback);
router.get('/operations/executive-metrics', OperationsController.getExecutiveMetrics);
router.get('/operations/learning-center', OperationsController.getLearningCenter);

// Sustainability alias endpoint
router.get('/sustainability', OperationsController.getSustainability);

// ==========================================
// 8. Observability & Health Endpoint
// ==========================================
router.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    database: 'CONNECTED',
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
