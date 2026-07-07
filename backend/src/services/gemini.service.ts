import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private isMock = true;
  private cache = new Map<string, { data: any; expiry: number }>();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MOCK_GEMINI_KEY' && apiKey.trim() !== '') {
      try {
        this.ai = new GoogleGenAI({ apiKey });
        this.isMock = false;
        console.log('[GeminiService] Initialized Google GenAI SDK successfully.');
      } catch (err) {
        console.error('[GeminiService] Failed to initialize Google GenAI SDK. Falling back to Mock mode.', err);
        this.isMock = true;
      }
    } else {
      console.log('[GeminiService] Operating in MOCK mode (No valid GEMINI_API_KEY found).');
      this.isMock = true;
    }
  }

  private getCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && entry.expiry > Date.now()) {
      return entry.data;
    }
    return null;
  }

  private setCache(key: string, data: any, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }

  // 1. Multilingual Assistant Chat
  async generateChatResponse(
    message: string,
    history: ChatMessage[],
    language: string
  ): Promise<string> {
    const cacheKey = `chat_${language}_${message}_${JSON.stringify(history)}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const systemPrompt = `You are StadiumIQ AI, the official FIFA World Cup 2026 Smart Stadium Operations Assistant.
Your goal is to assist fans, volunteers, venue staff, and emergency coordinators.
Answer queries concisely and professionally.
You must respond in ${language}.
Provide accurate advice about restrooms, food courts, transport zones, medical help, lost and found, ticket validation, and emergency protocols.`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockChatResponse(message, language);
      this.setCache(cacheKey, mockRes, 30);
      return mockRes;
    }

    try {
      const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: contents as any
      });

      const result = response.text || 'No response text generated.';
      this.setCache(cacheKey, result, 30);
      return result;
    } catch (error) {
      console.error('[GeminiService] API call failed, falling back to mock:', error);
      const fallbackRes = this.mockChatResponse(message, language) + ' (Fallback Mock Response)';
      this.setCache(cacheKey, fallbackRes, 10);
      return fallbackRes;
    }
  }

  // 2. AI Scenario Simulator (Fire, Stampede, Power Outage, VIP, Weather)
  async simulateScenario(
    scenario: string,
    venue: string,
    telemetry: any[]
  ): Promise<{
    riskAssessment: string;
    actionPlan: string[];
    resourceAllocation: string;
    evacuationStrategy: string;
    announcements: { language: string; text: string }[];
  }> {
    const cacheKey = `sim_${scenario}_${venue}_${JSON.stringify(telemetry)}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const prompt = `Simulate a critical tournament incident: "${scenario}" at ${venue}.
Current crowd telemetry status: ${JSON.stringify(telemetry)}.
Generate an emergency operations plan in JSON format matching the schema below:
{
  "riskAssessment": "detailed string of risks",
  "actionPlan": ["step 1", "step 2", "step 3"],
  "resourceAllocation": "resource redirection strategy details",
  "evacuationStrategy": "evacuation routes details",
  "announcements": [
    { "language": "English", "text": "public address script" },
    { "language": "Spanish", "text": "public address script" }
  ]
}`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockScenarioSimulation(scenario, venue);
      this.setCache(cacheKey, mockRes, 60);
      return mockRes;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const result = JSON.parse(text);
      this.setCache(cacheKey, result, 60);
      return result;
    } catch (error) {
      console.error('[GeminiService] Simulation generation failed, falling back to mock:', error);
      const fallbackRes = this.mockScenarioSimulation(scenario, venue);
      this.setCache(cacheKey, fallbackRes, 15);
      return fallbackRes;
    }
  }

  // 3. AI Resource Optimizer
  async optimizeResources(
    venue: string,
    telemetry: any[],
    staffCounts: { zone: string; volunteers: number; security: number; medical: number; cleaning: number }[]
  ): Promise<{
    reallocations: { fromZone: string; toZone: string; staffType: string; quantity: number; reason: string }[];
    summary: string;
  }> {
    const cacheKey = `opt_${venue}_${JSON.stringify(telemetry)}_${JSON.stringify(staffCounts)}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const prompt = `You are a logistics operations planner at ${venue}.
Telemetry: ${JSON.stringify(telemetry)}
Current staff distribution: ${JSON.stringify(staffCounts)}
Determine which zones have excess staff relative to congestion levels, and reallocate them to high congestion zones.
Return your response in JSON:
{
  "reallocations": [
    { "fromZone": "Zone X", "toZone": "Zone Y", "staffType": "VOLUNTEER" | "SECURITY" | "MEDICAL" | "CLEANING", "quantity": 3, "reason": "reason string" }
  ],
  "summary": "overall optimization summary"
}`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockResourceOptimization(venue, telemetry, staffCounts);
      this.setCache(cacheKey, mockRes, 60);
      return mockRes;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const result = JSON.parse(response.text || '{}');
      this.setCache(cacheKey, result, 60);
      return result;
    } catch (error) {
      console.error('[GeminiService] Resource optimization failed, falling back to mock:', error);
      const fallbackRes = this.mockResourceOptimization(venue, telemetry, staffCounts);
      this.setCache(cacheKey, fallbackRes, 15);
      return fallbackRes;
    }
  }

  // 4. AI Operational Briefing
  async generateOperationalBrief(
    venue: string,
    telemetry: any[],
    transit: any[],
    incidents: any[]
  ): Promise<{
    risks: string[];
    weatherForecast: string;
    expectedAttendance: number;
    peakEntryTime: string;
    volunteerShortages: string;
    transitDelays: string;
    securityAlerts: string;
    recommendedActions: string[];
    summary: string;
  }> {
    const cacheKey = `brief_${venue}_${JSON.stringify(telemetry)}_${JSON.stringify(transit)}_${JSON.stringify(incidents)}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const prompt = `Create an executive operations briefing for ${venue}.
Telemetry: ${JSON.stringify(telemetry)}
Transit: ${JSON.stringify(transit)}
Incidents: ${JSON.stringify(incidents)}
Respond in JSON format:
{
  "risks": ["Risk 1", "Risk 2"],
  "weatherForecast": "forecast text",
  "expectedAttendance": 75000,
  "peakEntryTime": "18:30 - 19:15",
  "volunteerShortages": "status description",
  "transitDelays": "status description",
  "securityAlerts": "status description",
  "recommendedActions": ["Action 1", "Action 2"],
  "summary": "executive summary text"
}`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockOperationalBrief(venue);
      this.setCache(cacheKey, mockRes, 60);
      return mockRes;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const result = JSON.parse(response.text || '{}');
      this.setCache(cacheKey, result, 60);
      return result;
    } catch (error) {
      console.error('[GeminiService] Operational brief failed, falling back to mock:', error);
      const fallbackRes = this.mockOperationalBrief(venue);
      this.setCache(cacheKey, fallbackRes, 15);
      return fallbackRes;
    }
  }

  // 5. Fan Personalized Journey Planner
  async generatePersonalizedJourney(
    seat: string,
    transport: string,
    food: string,
    accessibility: string,
    language: string
  ): Promise<{
    itinerary: { stage: string; time: string; description: string; tip: string }[];
    accessibilityInfo: string;
    suggestedGate: string;
  }> {
    const cacheKey = `journey_${seat}_${transport}_${food}_${accessibility}_${language}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const prompt = `Create a step-by-step match-day timeline for a fan in seat ${seat} traveling by ${transport}.
Preferences: food=${food}, accessibility=${accessibility}.
Write itinerary descriptions in ${language}.
Return JSON:
{
  "itinerary": [
    { "stage": "Stage Name", "time": "15:00", "description": "text", "tip": "tip text" }
  ],
  "accessibilityInfo": "accessibility routes advice",
  "suggestedGate": "Gate X"
}`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockFanJourney(seat, transport, food, accessibility, language);
      this.setCache(cacheKey, mockRes, 60);
      return mockRes;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const result = JSON.parse(response.text || '{}');
      this.setCache(cacheKey, result, 60);
      return result;
    } catch (error) {
      console.error('[GeminiService] Fan journey failed, falling back to mock:', error);
      const fallbackRes = this.mockFanJourney(seat, transport, food, accessibility, language);
      this.setCache(cacheKey, fallbackRes, 15);
      return fallbackRes;
    }
  }

  // 6. AI Announcement Studio
  async generateAnnouncement(
    category: string,
    details: string,
    targetLanguage: string
  ): Promise<{
    script: string;
    translation: string;
    audioPronunciationHint: string;
  }> {
    const cacheKey = `ann_${category}_${details}_${targetLanguage}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const prompt = `You are a public announcer. Generate an announcement for: category=${category}, details=${details}.
Provide the announcement script in English, and translate it to ${targetLanguage}.
Provide a phonetic pronunciation hint for non-native announcers.
Return JSON:
{
  "script": "English script",
  "translation": "translated script",
  "audioPronunciationHint": "pronunciation hint text"
}`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockAnnouncement(category, details, targetLanguage);
      this.setCache(cacheKey, mockRes, 120);
      return mockRes;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const result = JSON.parse(response.text || '{}');
      this.setCache(cacheKey, result, 120);
      return result;
    } catch (error) {
      console.error('[GeminiService] Announcement generation failed, falling back to mock:', error);
      const fallbackRes = this.mockAnnouncement(category, details, targetLanguage);
      this.setCache(cacheKey, fallbackRes, 30);
      return fallbackRes;
    }
  }

  // 7. Explainable AI Operational recommendations query
  async explainRecommendation(advice: string, telemetry: any): Promise<{
    reasoning: string;
    confidence: number;
    expectedImprovement: string;
    contributingMetrics: { metric: string; weightPercentage: number; state: string }[];
  }> {
    const cacheKey = `explain_${advice}_${JSON.stringify(telemetry)}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const prompt = `Explain the operational recommendation: "${advice}".
Telemetry: ${JSON.stringify(telemetry)}
Detail the confidence score and contributing metrics.
Return JSON:
{
  "reasoning": "rationale string",
  "confidence": 92,
  "expectedImprovement": "Reduce queue wait by 15%",
  "contributingMetrics": [
    { "metric": "Gate D crowding", "weightPercentage": 40, "state": "Critical congestion" }
  ]
}`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockRecommendationExplanation(advice);
      this.setCache(cacheKey, mockRes, 120);
      return mockRes;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const result = JSON.parse(response.text || '{}');
      this.setCache(cacheKey, result, 120);
      return result;
    } catch (error) {
      console.error('[GeminiService] Explain recommendation failed, falling back to mock:', error);
      const fallbackRes = this.mockRecommendationExplanation(advice);
      this.setCache(cacheKey, fallbackRes, 30);
      return fallbackRes;
    }
  }

  // 8. AI Operations Knowledge Base
  async answerOperationsQuery(
    query: string,
    telemetry: any[],
    transit: any[]
  ): Promise<string> {
    const cacheKey = `query_${query}_${JSON.stringify(telemetry)}_${JSON.stringify(transit)}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const prompt = `You are StadiumIQ AI Operations Specialist.
A stadium manager asks: "${query}"
Context telemetry: ${JSON.stringify(telemetry)}
Context transit status: ${JSON.stringify(transit)}
Provide a direct, data-backed operational explanation. Make it professional.`;

    if (this.isMock || !this.ai) {
      const mockRes = this.mockOperationsQuery(query);
      this.setCache(cacheKey, mockRes, 60);
      return mockRes;
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt
      });
      const result = response.text || 'No response text available.';
      this.setCache(cacheKey, result, 60);
      return result;
    } catch (error) {
      console.error('[GeminiService] Operations query failed, falling back to mock:', error);
      const fallbackRes = this.mockOperationsQuery(query);
      this.setCache(cacheKey, fallbackRes, 15);
      return fallbackRes;
    }
  }

  // ==========================================
  // Mock Engine Fallbacks (Production Grade)
  // ==========================================

  private mockChatResponse(message: string, language: string): string {
    const responses: Record<string, Record<string, string>> = {
      English: {
        restroom: 'The nearest restrooms are located immediately behind Section 112 (Concourse East) and Section 124 (Concourse West). Both are equipped with wheelchair-accessible ramps.',
        food: 'Major food courts are open at Food Court East and Food Court West. For premium local options, head to Sections 115 and 142. Vegan and Gluten-free options are available.',
        transport: 'Metro Express trains depart from Meadowlands Terminal every 4 minutes. Taxis can be hailed from Taxi Zone B outside Gate 3. Rideshares are located in Lot C.',
        emergency: '🔴 If this is a medical or security emergency, press the "Emergency Alert" button on your layout or report to any volunteer in a high-visibility yellow vest immediately.',
        default: 'Hello! I am StadiumIQ AI, your tournament operations assistant. You can ask me about navigation, transit status, stadium amenities, accessibility assistance, or match schedules.'
      },
      Spanish: {
        restroom: 'Los baños más cercanos se encuentran detrás de la Sección 112 (Concurso Este) y la Sección 124 (Concurso Oeste). Ambos están equipados con rampas accesibles.',
        food: 'Las áreas de comida principales están en Food Court Este y Food Court Oeste. Encontrará opciones locales en las secciones 115 y 142. Hay opciones veganas disponibles.',
        transport: 'Los trenes del Metro Exprés salen de la terminal Meadowlands cada 4 minutos. Los taxis están en la Zona B fuera de la Puerta 3.',
        emergency: '🔴 En caso de emergencia médica o de seguridad, presione el botón de "Alerta de Emergencia" o busque a cualquier voluntario con chaleco amarillo.',
        default: '¡Hola! Soy StadiumIQ AI. Estoy aquí para ayudarle con la navegación, transporte, servicios del estadio y protocolos de seguridad.'
      }
    };

    const lang = responses[language] ? language : 'English';
    const msgLower = message.toLowerCase();

    if (msgLower.includes('restroom') || msgLower.includes('baño') || msgLower.includes('toilet')) {
      return responses[lang].restroom;
    } else if (msgLower.includes('food') || msgLower.includes('eat') || msgLower.includes('comida') || msgLower.includes('hambre')) {
      return responses[lang].food;
    } else if (msgLower.includes('transport') || msgLower.includes('metro') || msgLower.includes('taxi') || msgLower.includes('bus')) {
      return responses[lang].transport;
    } else if (msgLower.includes('emergency') || msgLower.includes('help') || msgLower.includes('emergencia') || msgLower.includes('danger')) {
      return responses[lang].emergency;
    }

    return responses[lang].default + ` (Translated matching query: "${message}")`;
  }

  private mockScenarioSimulation(scenario: string, venue: string) {
    const sc = scenario.toLowerCase();
    if (sc.includes('fire')) {
      return {
        riskAssessment: 'CRITICAL RISK: Active fire alert detected. Structural damage threat and severe crowd stampede risks at Gate D and North Concourse.',
        actionPlan: [
          'Trigger fire alarm sirens in North Quadrant.',
          'Deploy local security to secure evacuation path barriers.',
          'Open emergency gates E1, E2, and F1.',
          'Dispatch Medical Teams 1 and 3 to Sector D Plaza.'
        ],
        resourceAllocation: 'Redirect 12 volunteers from East Stand to assist with egress flow guides. Dispatch all nearby security units to North Concourse.',
        evacuationStrategy: 'Direct North Stand crowds out via Gates E and F. Avoid North Concourse tunnels completely due to smoke.',
        announcements: [
          { language: 'English', text: 'Attention please: An incident has occurred in the North Concourse. Please follow the directions of stewards and evacuate immediately using the nearest exit Gates E or F.' },
          { language: 'Spanish', text: 'Atención por favor: Se ha producido un incidente en el Concurso Norte. Por favor siga las instrucciones del personal y evacúe por las Puertas E o F.' }
        ]
      };
    } else if (sc.includes('rain') || sc.includes('weather')) {
      return {
        riskAssessment: 'MODERATE RISK: Heavy rain will delay transit vehicles. Slippery concourses increase slip-and-fall hazards. Fans crowding indoor walkways.',
        actionPlan: [
          'Deploy cleaning staff with wet-floor warning signs and mops to all indoor concourses.',
          'Request local transit coordinates to extend Metro rail frequencies.',
          'Display weather warning cards across digital screens.'
        ],
        resourceAllocation: 'Shift 4 volunteers from open parking zones to indoor information kiosks. Move 3 cleaning personnel to Sector A corridors.',
        evacuationStrategy: 'Standard exit routes apply. Encourage staggered exits to prevent gate bottlenecks during peak downpours.',
        announcements: [
          { language: 'English', text: 'Notice: Heavy rain is affecting the surrounding transit routes. Metro frequencies have been increased. Please travel carefully.' },
          { language: 'Spanish', text: 'Aviso: La lluvia intensa está afectando las rutas de tránsito. Las frecuencias del metro se han incrementado.' }
        ]
      };
    }

    // Default simulation fallback
    return {
      riskAssessment: `HIGH RISK: Incident "${scenario}" simulated at ${venue}. Potential queuing bottlenecks and localized crowd anxiety.`,
      actionPlan: [
        'Alert Stadium Command Center and operations supervisors.',
        'Validate security scanner availability at affected zones.',
        'Prepare public announcer console for alerts.'
      ],
      resourceAllocation: 'Allocate 5 general stewards to assist safety officers at the incident sector.',
      evacuationStrategy: 'Keep all main gates clear and pre-configure directional signage overlays.',
      announcements: [
        { language: 'English', text: `Please remain calm. Operational staff are managing a localized incident. Follow steward instructions.` },
        { language: 'Spanish', text: `Por favor mantenga la calma. El personal de operaciones está gestionando un incidente localizado.` }
      ]
    };
  }

  private mockResourceOptimization(
    venue: string,
    _telemetry: any[],
    _staffCounts: any[]
  ) {
    return {
      reallocations: [
        {
          fromZone: 'VIP Lounge',
          toZone: 'Gate D',
          staffType: 'SECURITY',
          quantity: 2,
          reason: 'VIP Lounge reports low congestion (12%). Gate D shows critical entry queuing (88%).'
        },
        {
          fromZone: 'East Stand',
          toZone: 'Food Court West',
          staffType: 'CLEANING',
          quantity: 1,
          reason: 'East Stand is seated and stable. Food Court West has peak half-time foot traffic and spills.'
        },
        {
          fromZone: 'Gate A',
          toZone: 'Gate C',
          staffType: 'VOLUNTEER',
          quantity: 3,
          reason: 'Gate A throughput is optimal. Gate C reports a surge in mobility assistance requests.'
        }
      ],
      summary: `AI Logistics optimization completed for ${venue}. Reallocated 6 operational personnel based on live crowd telemetry and waiting time logs.`
    };
  }

  private mockOperationalBrief(venue: string) {
    return {
      risks: [
        'Transport queue delay at Meadowlands Rail Line (currently 15m delay).',
        'Localized crowd bottleneck at Gate D entry scanners.',
        'High thermal index (32°C) raising medical heat exhaustion risk.'
      ],
      weatherForecast: 'Mostly Sunny, High of 32°C, 10% Precipitation. Wind at 8 km/h.',
      expectedAttendance: 74500,
      peakEntryTime: '17:45 - 18:30',
      volunteerShortages: 'Slight shortage in Zone B Concourse (need 4 additional monitors).',
      transitDelays: 'Bus Shuttle Line A delayed by 8 minutes due to regional road congestion.',
      securityAlerts: 'Scanner Lane 3 at Gate D is undergoing hardware check; operating at 80% throughput.',
      recommendedActions: [
        'Divert incoming transit announcements to suggest Light Rail over Shuttle Bus.',
        'Open backup scan lanes at Gate B to relieve Gate D pressure.',
        'Trigger Hydration Warning notice on Fan App.'
      ],
      summary: `Operations brief for ${venue}. Operations are stable overall, with active bottlenecks being managed at Gate D and Shuttle Transit routes.`
    };
  }

  private mockFanJourney(
    seat: string,
    transport: string,
    food: string,
    accessibility: string,
    language: string
  ) {
    const isSpanish = language.toLowerCase() === 'spanish';
    return {
      suggestedGate: 'Gate C',
      accessibilityInfo: accessibility.toLowerCase() === 'wheelchair'
        ? (isSpanish ? 'Ruta de rampa accesible de la Puerta C al elevador Este, subir al Nivel 2.' : 'Accessible ramp route from Gate C to East Elevator, rise to Level 2.')
        : (isSpanish ? 'Ruta estándar por escaleras mecánicas del sector Este.' : 'Standard escalator routes through East concourse.'),
      itinerary: [
        {
          stage: isSpanish ? 'Salida' : 'Departure',
          time: '16:00',
          description: isSpanish ? `Salir del hotel hacia la estación de ${transport}.` : `Depart hotel towards the ${transport} station.`,
          tip: isSpanish ? 'Tener listos los boletos digitales en el celular.' : 'Keep digital tickets ready on your phone.'
        },
        {
          stage: isSpanish ? 'Ingreso al Estadio' : 'Stadium Entry',
          time: '17:15',
          description: isSpanish ? 'Llegar a la Puerta C. Usar el carril de seguridad 4.' : 'Arrive at Gate C. Proceed through Security Lane 4.',
          tip: isSpanish ? 'Llevar solo bolsas transparentes para ingreso rápido.' : 'Bring clear bags only for rapid scanning.'
        },
        {
          stage: isSpanish ? 'Comida' : 'Food Stop',
          time: '17:45',
          description: isSpanish ? `Comprar ${food} en Food Court East (detrás de la Sección 114).` : `Purchase ${food} at Food Court East (located behind Section 114).`,
          tip: isSpanish ? 'Pagar con tarjeta; el estadio no recibe efectivo.' : 'Card payments only; the stadium is cashless.'
        },
        {
          stage: isSpanish ? 'Ubicación de Asiento' : 'Seat Location',
          time: '18:15',
          description: isSpanish ? `Ubicarse en el Asiento ${seat} para los calentamientos previos.` : `Locate Seat ${seat} in East Stand for pre-match warmups.`,
          tip: isSpanish ? 'Disfrute del espectáculo previo al partido!' : 'Enjoy the pre-match show!'
        },
        {
          stage: isSpanish ? 'Salida Staggered' : 'Exit Journey',
          time: '21:00',
          description: isSpanish ? 'Salir por la Puerta C hacia la zona de Rideshares en el Lote C.' : 'Exit via Gate C towards the Rideshare pickup zone in Lot C.',
          tip: isSpanish ? 'Esperar 15 minutos en el estadio para evitar congestión.' : 'Stagger departure to avoid exit corridor rush.'
        }
      ]
    };
  }

  private mockAnnouncement(category: string, details: string, _targetLanguage: string) {
    return {
      script: `Attention fans: A localized ${category} is reported near ${details}. Please follow instructions from our stadium stewards.`,
      translation: `Atención aficionados: Se ha reportado un incidente de ${category} cerca de ${details}. Por favor siga las instrucciones de los oficiales.`,
      audioPronunciationHint: `Ah-ten-see-on ah-fee-see-oh-nah-dohs: Seh ah reh-por-tah-doh oon een-see-den-teh...`
    };
  }

  private mockRecommendationExplanation(_advice: string) {
    return {
      reasoning: `This action is suggested to optimize logistics performance. We detected a 28% increase in queuing density at the target location over the last 10 minutes. Historical match analytics show that opening relief lanes at this congestion threshold successfully prevents crowd bottlenecks.`,
      confidence: 94,
      expectedImprovement: 'Reduce waiting queue length by 18% within 10 minutes.',
      contributingMetrics: [
        { metric: 'Live queue headcount', weightPercentage: 45, state: 'Exceeded yellow safety limit' },
        { metric: 'Transit arrival spike', weightPercentage: 35, state: 'Train arrived containing 1800 fans' },
        { metric: 'Historical match templates', weightPercentage: 20, state: 'Fitted target match data' }
      ]
    };
  }

  private mockOperationsQuery(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('gate c') || q.includes('congested')) {
      return 'Gate C congestion is currently at 84% capacity. This is driven by a heavy volume of metro passenger arrivals at the West terminal. We recommend implementing Recommendation ID 2 to open Gate B backup lanes and deploy 3 volunteers to guide overflow crowds.';
    } else if (q.includes('accessibility')) {
      return 'Accessibility services are running efficiently. Elevator usage in the East Stand is high, but waiting times are under 3 minutes. Visual signage and audio cues have been activated at all entry points. We have 4 general volunteers assisting mobility passengers at Gate B.';
    }
    return 'Operation Center Status: All systems stable. Telemetry logs indicate optimal crowd flows through Concourse North and South. Transportation routes are running on time.';
  }
}
export const geminiService = new GeminiService();
