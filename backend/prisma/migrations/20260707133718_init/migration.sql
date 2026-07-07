-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'FAN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CrowdTelemetry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "zone" TEXT NOT NULL,
    "crowdCount" INTEGER NOT NULL,
    "capacityLimit" INTEGER NOT NULL,
    "queueLength" INTEGER NOT NULL,
    "avgWaitTimeSeconds" INTEGER NOT NULL,
    "congestionLevel" REAL NOT NULL,
    "riskZone" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TransitStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "transportType" TEXT NOT NULL,
    "lineName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ON_TIME',
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "occupancyPercentage" INTEGER NOT NULL,
    "parkingOccupancy" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SustainabilityMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "energyKWh" REAL NOT NULL,
    "waterLiters" REAL NOT NULL,
    "wasteKg" REAL NOT NULL,
    "recyclingPercent" REAL NOT NULL,
    "carbonKg" REAL NOT NULL,
    "solarGeneration" REAL NOT NULL DEFAULT 0.0,
    "foodWasteKg" REAL NOT NULL DEFAULT 0.0,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REPORTED',
    "location" TEXT NOT NULL,
    "reportedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME
);

-- CreateTable
CREATE TABLE "IncidentTimeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "incidentId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IncidentTimeline_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VolunteerTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assigneeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VolunteerTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CrowdAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "type" TEXT NOT NULL DEFAULT 'BOTTLENECK',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "message" TEXT NOT NULL,
    "suggestedAction" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OperationalRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "category" TEXT NOT NULL,
    "advice" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL DEFAULT '',
    "confidence" INTEGER NOT NULL DEFAULT 90,
    "expectedImprovement" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StaffReallocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "fromZone" TEXT NOT NULL,
    "toZone" TEXT NOT NULL,
    "staffType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LearningLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "venue" TEXT NOT NULL DEFAULT 'METLIFE_STADIUM',
    "eventName" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "humanAction" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "lessonsLearned" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AIFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recommendationId" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "comments" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
