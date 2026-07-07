import { prisma } from '../config/db';

export class AuditLogRepository {
  static async log(userId: string | null, action: string, details: string) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        details
      }
    });
  }
}
