import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@shopflow/shared';

describe('AuthService (Security & Core Auth)', () => {
  let authService: AuthService;
  let prismaService: any;
  let redisService: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    redisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: RedisService, useValue: redisService },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_jwt_access_token'),
            decode: jest.fn().mockReturnValue({ jti: 'mock_jti' }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should register a new customer with hashed credentials and tokens', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);
    prismaService.user.create.mockResolvedValue({
      id: 'usr-1',
      email: 'test@example.com',
      name: 'Test Customer',
      role: UserRole.CUSTOMER,
      isTwoFactorEnabled: false,
      phone: '+919999999999',
    });

    const res = await authService.register({
      name: 'Test Customer',
      email: 'test@example.com',
      password: 'Password@123',
      role: UserRole.CUSTOMER,
    });

    expect(res.user.email).toBe('test@example.com');
    expect(res.tokens.accessToken).toBe('mock_jwt_access_token');
    expect(res.tokens.refreshToken).toBeDefined();
  });

  it('should enforce account lockout after 5 consecutive failed login attempts', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      id: 'usr-1',
      email: 'test@example.com',
      passwordHash: 'pbkdf2:salt:invalidhash',
      failedLoginAttempts: 4,
      lockoutUntil: null,
      isActive: true,
      role: UserRole.CUSTOMER,
    });

    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'WrongPassword@123',
      }),
    ).rejects.toThrow('Account locked due to 5 failed attempts');

    expect(prismaService.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'usr-1' },
        data: expect.objectContaining({
          failedLoginAttempts: 0,
          lockoutUntil: expect.any(Date),
        }),
      }),
    );
  });
});
