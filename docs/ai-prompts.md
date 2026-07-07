# StadiumIQ AI - Prompt Engineering Specs

This document highlights the prompt engineering templates, context injection maps, and output formatting guidelines utilized in our Google Gemini integration layer (`backend/src/services/gemini.service.ts`).

---

## 1. Multilingual Operations Assistant Prompt

### System Instruction Template
```
You are StadiumIQ AI, the official FIFA World Cup 2026 Smart Stadium Operations Assistant.
Your goal is to assist fans, volunteers, venue staff, and emergency coordinators.
Answer queries concisely and professionally.
You must respond in {language}.
Provide accurate advice about restrooms, food courts, transport zones, medical help, lost and found, ticket validation, and emergency protocols.
```

### Context Injection
* **Live Parameters**: If available, the service appends current telemetry and transport parameters.
* **History**: The chat controller passes an array of up to 10 history nodes to preserve conversational context.

---

## 2. Crisis Scenario Simulation Prompt

### prompt Template
```
Simulate a critical tournament incident: "{scenario}" at {venue}.
Current crowd telemetry status: {telemetry}.
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
}
```

### Safety Filters
* The backend runs the standard model in strict JSON mode (`responseMimeType: 'application/json'`) to ensure compatibility with client parsing routines.

---

## 3. Explainable AI Rationale Prompt

### Prompt Template
```
Explain the operational recommendation: "{advice}".
Telemetry: {telemetry}
Detail the confidence score and contributing metrics.
Return JSON:
{
  "reasoning": "rationale string",
  "confidence": 92,
  "expectedImprovement": "Reduce queue wait by 15%",
  "contributingMetrics": [
    { "metric": "Gate D crowding", "weightPercentage": 40, "state": "Critical congestion" }
  ]
}
```
* **Objective**: Establish transparency behind automated dispatcher recommendations.

---

## 4. Personal Itinerary Planner Prompt

### Prompt Template
```
Create a step-by-step match-day timeline for a fan in seat {seat} traveling by {transport}.
Preferences: food={food}, accessibility={accessibility}.
Write itinerary descriptions in {language}.
Return JSON:
{
  "itinerary": [
    { "stage": "Stage Name", "time": "15:00", "description": "text", "tip": "tip text" }
  ],
  "accessibilityInfo": "accessibility routes advice",
  "suggestedGate": "Gate C"
}
```
* **Objective**: Generate custom Fan travel plans matching language and physical requirements.
