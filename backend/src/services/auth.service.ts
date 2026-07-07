import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AuditLogRepository } from '../repositories/auditLog.repository';
import { ValidationError, AuthenticationError } from '../middlewares/error';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'FIFA2026_TournamentOperationsSecureTokenKey!';

export class AuthService {
  static async signup(email: string, password: string, name: string, role: Role) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('A user with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.create({ email, passwordHash, name, role });

    await AuditLogRepository.log(newUser.id, 'USER_SIGNUP', `User ${name} registered with role ${role}`);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } };
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await AuditLogRepository.log(user.id, 'USER_LOGIN', `User logged in`);

    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new ValidationError('User profile not found.');
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
