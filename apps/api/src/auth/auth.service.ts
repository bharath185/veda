import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  VerifyTotpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthResponse,
  UserRole,
} from '@shopflow/shared';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password, { type: argon2.argon2id });
    } catch {
      // Fallback to pbkdf2 if native argon2 bindings fail on environment
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      return `pbkdf2:${salt}:${hash}`;
    }
  }

  private async verifyPassword(plain: string, hashed: string): Promise<boolean> {
    if (hashed.startsWith('pbkdf2:')) {
      const parts = hashed.split(':');
      const salt = parts[1];
      const originalHash = parts[2];
      const testHash = crypto.pbkdf2Sync(plain, salt, 100000, 64, 'sha512').toString('hex');
      return testHash === originalHash;
    }
    // Also check seed static fallback
    if (hashed.length === 128) {
      const seedHash = crypto.pbkdf2Sync(plain, 'shopflow_static_salt_for_dev_seed', 100000, 64, 'sha512').toString('hex');
      if (seedHash === hashed) return true;
    }
    try {
      return await argon2.verify(hashed, plain);
    } catch {
      return false;
    }
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.hashPassword(input.password);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        role: input.role as any,
        phone: input.phone,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        phone: user.phone,
      },
      tokens,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check account lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const minutesRemaining = Math.ceil(
        (user.lockoutUntil.getTime() - Date.now()) / (1000 * 60),
      );
      throw new ForbiddenException(
        `Account locked due to 5 failed attempts. Please retry in ${minutesRemaining} minute(s).`,
      );
    }

    const isValidPassword = await this.verifyPassword(input.password, user.passwordHash);
    if (!isValidPassword) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const lockoutUntil =
        failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts >= 5 ? 0 : failedAttempts,
          lockoutUntil,
        },
      });

      if (lockoutUntil) {
        throw new ForbiddenException('Account locked due to 5 failed attempts. Please retry in 15 minutes.');
      }
      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset failed login attempts on successful credentials
    if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockoutUntil: null },
      });
    }

    // Check 2FA if enabled
    if (user.isTwoFactorEnabled) {
      if (!input.code) {
        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            isTwoFactorEnabled: true,
            phone: user.phone,
          },
          tokens: { accessToken: '', refreshToken: '', expiresIn: 0 },
          requires2FA: true,
        };
      }

      const isValidCode = authenticator.verify({
        token: input.code,
        secret: user.twoFactorSecret || '',
      });

      if (!isValidCode) {
        throw new UnauthorizedException('Invalid 2FA verification code');
      }
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
        phone: user.phone,
      },
      tokens,
    };
  }

  async refreshToken(input: RefreshTokenInput): Promise<AuthResponse> {
    const tokenHash = crypto.createHash('sha256').update(input.refreshToken).digest('hex');

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate refresh token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
    );

    return {
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        name: storedToken.user.name,
        role: storedToken.user.role as UserRole,
        isTwoFactorEnabled: storedToken.user.isTwoFactorEnabled,
        phone: storedToken.user.phone,
      },
      tokens,
    };
  }

  async logout(userId: string, accessToken?: string): Promise<{ success: boolean }> {
    // Revoke all refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    // Revoke access token in Redis blacklist
    if (accessToken) {
      try {
        const decoded = this.jwtService.decode(accessToken) as any;
        if (decoded?.jti) {
          await this.redis.set(`token_blacklist:${decoded.jti}`, 'revoked', 15 * 60);
        }
      } catch {
        // ignore
      }
    }

    return { success: true };
  }

  async generate2faSecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'ShopFlow', secret);
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    return { secret, qrCode };
  }

  async verifyAndEnable2fa(userId: string, input: VerifyTotpInput): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA setup not initiated');
    }

    const isValid = authenticator.verify({
      token: input.token,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid TOTP token');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });

    return { success: true };
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetKey = `pwd_reset:${resetToken}`;
      await this.redis.set(resetKey, user.id, 60 * 60); // 1 hour validity
      // In production, send via email queue
    }
    return { message: 'If this email exists, a password reset link has been dispatched.' };
  }

  async resetPassword(input: ResetPasswordInput): Promise<{ success: boolean }> {
    const resetKey = `pwd_reset:${input.token}`;
    const userId = await this.redis.get(resetKey);
    if (!userId) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const passwordHash = await this.hashPassword(input.password);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.redis.del(resetKey);
    return { success: true };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const jti = crypto.randomUUID();
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role, jti },
      {
        secret: process.env.JWT_ACCESS_SECRET || 'shopflow_super_secret_access_jwt_key_at_least_32_chars_long',
        expiresIn: '15m',
      },
    );

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 15 * 60,
    };
  }
}
