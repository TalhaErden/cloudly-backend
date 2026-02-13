import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'cloudly-secret-jwt-key-2026',
    });
  }

  async validate(payload: any) {
    // ✅ JWT valid ise user obj'sini request'e ekle
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || ['user'],
    };
  }
}
