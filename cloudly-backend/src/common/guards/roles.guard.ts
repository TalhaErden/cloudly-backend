import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ✅ @Roles decorator yok = herkes girebilir
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // ✅ User roles'ü requiredRoles'dan herhangi biriyle eşleşiyor mu?
    const hasRole = () =>
      requiredRoles.some((role) => user?.roles?.includes(role));

    if (!user || !hasRole()) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
