import { prisma } from '../config/db';
import { Priority, TaskStatus } from '@prisma/client';

export class VolunteerRepository {
  static async getTasks() {
    return prisma.volunteerTask.findMany({
      include: { assignee: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(id: string) {
    return prisma.volunteerTask.findUnique({
      where: { id }
    });
  }

  static async createTask(data: {
    title: string;
    description: string;
    priority: Priority;
    assigneeId?: string | null;
  }) {
    return prisma.volunteerTask.create({
      data,
      include: { assignee: { select: { id: true, name: true, email: true } } }
    });
  }

  static async updateTask(id: string, data: { status?: TaskStatus; assigneeId?: string | null }) {
    return prisma.volunteerTask.update({
      where: { id },
      data,
      include: { assignee: { select: { id: true, name: true, email: true } } }
    });
  }

  static async getAvailableVolunteers() {
    return prisma.user.findMany({
      where: { role: 'VOLUNTEER' },
      select: { id: true, name: true, email: true }
    });
  }
}
