import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    // 1. Header varsa ve string türündeyse kontrol et
    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('Missing or invalid x-api-key header');
    }

    // 2. ENV'den valid key'i oku ve eşleştir
    const validApiKey = process.env.API_KEY || 'default-dev-key';
    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    // 3. Request'e koy (sonraki middleware/controller'lar için)
    request.apiKey = apiKey;
    return true;
  }
}