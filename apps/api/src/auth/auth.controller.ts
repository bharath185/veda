import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
  VerifyTotpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  VerifyTotpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@shopflow/shared';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new customer or vendor' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body(new ZodValidationPipe(RegisterSchema)) input: RegisterInput) {
    return this.authService.register(input);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email, password, and optional 2FA code' })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  async login(@Body(new ZodValidationPipe(LoginSchema)) input: LoginInput) {
    return this.authService.login(input);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue new access token' })
  async refresh(@Body(new ZodValidationPipe(RefreshTokenSchema)) input: RefreshTokenInput) {
    return this.authService.refreshToken(input);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and revoke active session' })
  async logout(
    @CurrentUser() user: any,
    @Headers('authorization') authHeader?: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.logout(user.id, token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@CurrentUser() user: any) {
    return user;
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate TOTP secret and QR code for 2FA' })
  async enable2fa(@CurrentUser() user: any) {
    return this.authService.generate2faSecret(user.id);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify and activate 2FA with 6-digit TOTP token' })
  async verify2fa(
    @CurrentUser() user: any,
    @Body(new ZodValidationPipe(VerifyTotpSchema)) input: VerifyTotpInput,
  ) {
    return this.authService.verifyAndEnable2fa(user.id, input);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  async forgotPassword(@Body(new ZodValidationPipe(ForgotPasswordSchema)) input: ForgotPasswordInput) {
    return this.authService.forgotPassword(input);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token' })
  async resetPassword(@Body(new ZodValidationPipe(ResetPasswordSchema)) input: ResetPasswordInput) {
    return this.authService.resetPassword(input);
  }

  @Get('oauth/google')
  @ApiOperation({ summary: 'Google OAuth login endpoint' })
  async googleOAuth() {
    return {
      message: 'Redirect to Google OAuth consent screen',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=shopflow_mock&response_type=code',
    };
  }

  @Get('oauth/apple')
  @ApiOperation({ summary: 'Apple Sign In endpoint' })
  async appleOAuth() {
    return {
      message: 'Redirect to Apple Sign In consent screen',
      authUrl: 'https://appleid.apple.com/auth/authorize?client_id=shopflow_mock&response_type=code',
    };
  }
}
