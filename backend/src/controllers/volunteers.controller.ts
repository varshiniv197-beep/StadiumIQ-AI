import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RequestWithUser } from '../middlewares/auth';
import { VolunteerService } from '../services/volunteer.service';
import { sendResponse } from '../utils/response';
import { Priority, TaskStatus } from '@prisma/client';

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
      const tasks = await VolunteerService.getTasks();
      return sendResponse(res, 200, true, 'Volunteer tasks retrieved successfully.', { tasks });
    } catch (error) {
      return next(error);
    }
  }

  // 2. Create a volunteer task
  static async createTask(req: RequestWithUser, res: Response, next: NextFunction) {
    const { title, description, priority } = req.body;
    try {
      const task = await VolunteerService.createTask(title, description, priority as Priority);
      return sendResponse(res, 201, true, 'Volunteer task created successfully.', { task });
    } catch (error) {
      return next(error);
    }
  }

  // 3. Update task (Self-assign, update status)
  static async updateTask(req: RequestWithUser, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status, assigneeId } = req.body;
    try {
      const task = await VolunteerService.updateTask(id, status as TaskStatus, assigneeId);
      return sendResponse(res, 200, true, 'Volunteer task updated successfully.', { task });
    } catch (error) {
      return next(error);
    }
  }

  // 4. Get active volunteer counts and status coordinates (Volunteer Live Map simulation)
  static async getVolunteerLocations(_req: Request, res: Response, next: NextFunction) {
    try {
      const volunteers = await VolunteerService.getVolunteerLocations();
      return sendResponse(res, 200, true, 'Volunteer locations retrieved successfully.', { volunteers });
    } catch (error) {
      return next(error);
    }
  }
}
