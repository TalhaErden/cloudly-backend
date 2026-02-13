import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Generate JWT token for authentication' })
  @ApiResponse({
    status: 200,
    description: 'JWT token generated successfully',
    schema: {
      properties: {
        access_token: { type: 'string' },
        token_type: { type: 'string' },
        expires_in: { type: 'string' },
      },
    },
  })
  login(@Body() body: { email: string; role?: string }) {
    // 🎯 Demo: herhangi bir email ile token oluştur
    // Prod'da burada password verify vs olmalı
    const roles = body.role === 'admin' ? ['admin', 'user'] : ['user'];
    return this.authService.generateToken(body.email, roles);
  }

  @Post('token/admin')
  @ApiOperation({ summary: 'Generate admin JWT token (demo)' })
  generateAdminToken() {
    return this.authService.generateAdminToken();
  }

  @Post('token/user')
  @ApiOperation({ summary: 'Generate user JWT token (demo)' })
  generateUserToken() {
    return this.authService.generateUserToken();
  }
}
