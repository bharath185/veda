import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  jti?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'shopflow_super_secret_access_jwt_key_at_least_32_chars_long',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.jti) {
      const isBlacklisted = await this.redis.get(`token_blacklist:${payload.jti}`);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    return user;
  }
}
