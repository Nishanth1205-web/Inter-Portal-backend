import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma, env } from '../config';
import { UnauthorizedError, NotFoundError, BadRequestError, logger } from '../utils';
import { createAuditLog } from '../middleware';

export class AuthService {
  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await createAuditLog(user.id, 'LOGIN', 'User', user.id, undefined, ipAddress, userAgent);

    logger.info(`User logged in: ${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, refreshToken?: string, ipAddress?: string, userAgent?: string) {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    } else {
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    await createAuditLog(userId, 'LOGOUT', 'User', userId, undefined, ipAddress, userAgent);
    logger.info(`User logged out: ${userId}`);
  }

  async refreshAccessToken(refreshTokenStr: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenStr },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedError('Refresh token expired');
    }

    if (!tokenRecord.user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
    const newRefreshToken = await this.generateRefreshToken(tokenRecord.userId);
    const accessToken = this.generateAccessToken(tokenRecord.user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Don't reveal whether email exists
      return { message: 'If your email is registered, you will receive a password reset link.' };
    }

    const resetToken = uuidv4();
    // In production, send email. For dev, log the token.
    logger.info(`Password reset token for ${email}: ${resetToken}`);
    
    // Store the token temporarily (using refresh token table for simplicity)
    await prisma.refreshToken.create({
      data: {
        token: `reset_${resetToken}`,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    });

    return { message: 'If your email is registered, you will receive a password reset link.', resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: `reset_${token}` },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      }),
      // Invalidate all existing refresh tokens for this user
      prisma.refreshToken.deleteMany({
        where: { userId: tokenRecord.userId },
      }),
    ]);

    await createAuditLog(tokenRecord.userId, 'PASSWORD_RESET', 'User', tokenRecord.userId);

    return { message: 'Password has been reset successfully' };
  }

  async registerStudent(data: any, ipAddress?: string, userAgent?: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'STUDENT',
        },
      });

      await tx.student.create({
        data: {
          userId: newUser.id,
          enrollmentNo: data.enrollmentNo,
          departmentId: data.departmentId,
          batchId: data.batchId,
        },
      });

      return newUser;
    });

    await createAuditLog(user.id, 'REGISTER', 'User', user.id, undefined, ipAddress, userAgent);
    logger.info(`New student registered: ${user.email}`);

    // Automatically log them in
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        phone: true,
        lastLoginAt: true,
        createdAt: true,
        student: {
          include: {
            department: true,
            batch: true,
          },
        },
        admin: true,
      },
    });

    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  private generateAccessToken(user: any): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRY as any }
    );
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }
}

export const authService = new AuthService();
