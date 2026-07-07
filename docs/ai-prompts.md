# AI Prompting Schemas

We leverage Google Gemini AI to coordinate crowd analysis, simulate drills, and draft localized announcements. All prompts return strict structured JSON payloads to prevent structural parsing errors.

## 1. Operations Briefing Prompt

```text
Create an executive operations briefing for [Venue].
Telemetry: [Telemetry Data]
Transit: [Transit Data]
Incidents: [Incidents Data]
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
}
```

## 2. Emergency Simulation Prompt

```text
Simulate a critical tournament incident: "[Incident Type]" at [Venue].
Current crowd telemetry status: [Telemetry Data].
Generate an emergency operations plan in JSON:
{
  "riskAssessment": "detailed string of risks",
  "actionPlan": ["step 1", "step 2", "step 3"],
  "resourceAllocation": "resource redirection strategy details",
  "evacuationStrategy": "evacuation routes details",
  "announcements": [
    { "language": "English", "text": "public address script" }
  ]
}
```
