import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // ✅ Simple demo: email ve role'ü payload'a koy, JWT generate et
  generateToken(email: string, roles: string[] = ['user']) {
    const payload = {
      sub: email, // subject as email
      email,
      roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
      expires_in: '7d',
    };
  }

  // ✅ Admin token generator (test için)
  generateAdminToken(email: string = 'admin@cloudly.com') {
    return this.generateToken(email, ['admin', 'user']);
  }

  // ✅ User token generator (test için)
  generateUserToken(email: string = 'user@cloudly.com') {
    return this.generateToken(email, ['user']);
  }
}
