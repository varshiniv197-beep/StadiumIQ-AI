import { prisma } from '../config/db';
import { Role } from '@prisma/client';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  static async create(data: { email: string; passwordHash: string; name: string; role: Role }) {
    return prisma.user.create({
      data
    });
  }
}
