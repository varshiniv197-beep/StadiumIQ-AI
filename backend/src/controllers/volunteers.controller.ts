import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { z } from 'zod';
import { AppError } from '../middlewares/error';
import { RequestWithUser } from '../middlewares/auth';
import { Role, Priority, TaskStatus } from '@prisma/client';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title is required.'),
    description: z.string().min(5, 'Description is required.'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM')
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED']),
    assigneeId: z.string().nullable().optional()
  })
});

export class VolunteerController {
  // 1. Get all tasks
  static async getTasks(_req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await prisma.volunteerTask.findMany({
        include: { assignee: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json({ success: true, tasks });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Create a volunteer task
  static async createTask(req: RequestWithUser, res: Response, next: NextFunction) {
    const { title, description, priority } = req.body;
    try {
      const newTask = await prisma.volunteerTask.create({
        data: {
          title,
          description,
          priority: priority as Priority,
          status: 'OPEN' as TaskStatus
        }
      });
      return res.status(201).json({ success: true, task: newTask });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Update task (Self-assign, update status)
  static async updateTask(req: RequestWithUser, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status, assigneeId } = req.body;
    try {
      const task = await prisma.volunteerTask.findUnique({ where: { id } });
      if (!task) {
        return next(new AppError(404, 'Volunteer task not found.'));
      }

      // Prepare updates
      const dataUpdate: any = { status: status as TaskStatus };
      if (assigneeId !== undefined) {
        dataUpdate.assigneeId = assigneeId;
      }

      const updated = await prisma.volunteerTask.update({
        where: { id },
        data: dataUpdate,
        include: { assignee: { select: { name: true } } }
      });

      return res.status(200).json({ success: true, task: updated });
    } catch (error) {
      return next(error);
    }
  }

  // 4. Get active volunteer counts and status coordinates (Volunteer Live Map simulation)
  static async getVolunteerLocations(_req: Request, res: Response, next: NextFunction) {
    try {
      // Generate simulated coordinates for active volunteers
      const volunteerUsers = await prisma.user.findMany({
        where: { role: 'VOLUNTEER' as Role }
      });

      const mockStatuses = ['AVAILABLE', 'ASSISTING', 'RESPONDING', 'BREAK'];
      const mockLocations = [
        { lat: 40.8125, lng: -74.0744, zone: 'Gate A' },
        { lat: 40.8135, lng: -74.0734, zone: 'North Concourse' },
        { lat: 40.8115, lng: -74.0754, zone: 'Section 112' },
        { lat: 40.8120, lng: -74.0724, zone: 'Food Court West' },
        { lat: 40.8140, lng: -74.0714, zone: 'Gate D' }
      ];

      const volunteersMap = volunteerUsers.map((user, idx) => {
        const loc = mockLocations[idx % mockLocations.length];
        const status = mockStatuses[idx % mockStatuses.length];
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status,
          lat: loc.lat,
          lng: loc.lng,
          zone: loc.zone
        };
      });

      return res.status(200).json({
        success: true,
        volunteers: volunteersMap
      });
    } catch (error) {
      return next(error);
    }
  }
}
