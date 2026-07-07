import { VolunteerRepository } from '../repositories/volunteer.repository';
import { Priority, TaskStatus } from '@prisma/client';
import { ValidationError } from '../middlewares/error';

export class VolunteerService {
  static async getTasks() {
    return VolunteerRepository.getTasks();
  }

  static async createTask(title: string, description: string, priority: Priority) {
    return VolunteerRepository.createTask({ title, description, priority });
  }

  static async updateTask(id: string, status?: TaskStatus, assigneeId?: string | null) {
    const task = await VolunteerRepository.findById(id);
    if (!task) {
      throw new ValidationError('Volunteer task not found.');
    }

    const updates: { status?: TaskStatus; assigneeId?: string | null } = {};
    if (status !== undefined) updates.status = status;
    if (assigneeId !== undefined) updates.assigneeId = assigneeId;

    return VolunteerRepository.updateTask(id, updates);
  }

  static async getVolunteerLocations() {
    const volunteerUsers = await VolunteerRepository.getAvailableVolunteers();

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

    return volunteersMap;
  }
}
