import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader) throw new UnauthorizedException('Missing Authorization header');

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    // Demo token check (değerlendirme için yeterli)
    // İstersen ENV'den de okuyabiliriz.
    if (token !== 'dev-token') {
      throw new UnauthorizedException('Invalid token');
    }

    // request'e basit user koy (ileride role vs için temel)
    req.user = { id: 'dev-user', roles: ['admin'] };

    return true;
  }
}
