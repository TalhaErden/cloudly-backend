# Cloudly Backend API

Cloudly case çalışması için geliştirilen **NestJS + TypeORM + SQLite** tabanlı backend servisidir.

## Özellikler

- Multi-tenant domain yapısı: **Organization → Project → Task**
- Tam CRUD endpointleri:
  - `organizations` (create/list/get/update/delete)
  - `projects` (create/list/get/update/delete)
  - `tasks` (create/list/get/update/delete)
- İş kuralı: `PATCH /tasks/:id/move`
  - Task yalnızca **aynı organization** altındaki projeye taşınabilir
- Swagger dokümantasyonu (`/api`)
- Global backend katmanları:
  - Guard (`ApiKeyGuard`)
  - Interceptor (`ResponseEnvelopeInterceptor`)
  - Middleware (`RequestLoggerMiddleware`)
  - Exception Filter (`GlobalExceptionFilter`)


## Teknolojiler

- NestJS
- TypeScript
- TypeORM
- SQLite
- class-validator / class-transformer
- Swagger (`@nestjs/swagger`)

---

## Kurulum

```bash
npm install
```

## Çalıştırma

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

## Test

```bash
npm test
```

---

## Temel Endpointler

### Organizations
- `POST /organizations`
- `GET /organizations`
- `GET /organizations/:id`
- `PATCH /organizations/:id`
- `DELETE /organizations/:id`

### Projects
- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

### Tasks
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/move`

---

## Notlar

- Uygulama varsayılan olarak `db.sqlite` dosyasını kullanır.
- `synchronize: true` açık olduğu için entity değişikliklerinde schema otomatik güncellenir.