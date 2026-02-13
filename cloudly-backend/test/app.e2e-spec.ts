import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Cloudly Backend API (e2e)', () => {
  let app: INestApplication<App>;
  let organizationId: number;
  let projectId: number;
  let taskId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // ✅ E2E'de global ValidationPipe ekle (main.ts'deki ile aynı)
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    
    await app.init();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          if (!res.body.data || res.body.data !== 'Hello World!') {
            throw new Error('Response envelope format incorrect or wrong data');
          }
        });
    });
  });

  describe('Organizations', () => {
    it('POST /organizations - Create organization', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({
          name: 'Test Organization',
          address: 'Istanbul, Turkey',
        })
        .expect(201)
        .expect((res) => {
          organizationId = res.body.data.id;
          if (!organizationId || res.body.data.name !== 'Test Organization') {
            throw new Error('Organization creation failed');
          }
        });
    });

    it('POST /organizations - Reject unknown field (forbidNonWhitelisted)', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({
          name: 'Test Org',
          hacker: true, // unknown field
        })
        .expect(400);
    });

    it('POST /organizations - Reject empty name', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({ name: '' })
        .expect(400);
    });

    it('POST /organizations - Reject whitespace-only name', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({ name: '   ' })
        .expect(400);
    });

    it('GET /organizations - List all organizations', () => {
      return request(app.getHttpServer())
        .get('/organizations')
        .expect(200)
        .expect((res) => {
          if (!Array.isArray(res.body.data)) {
            throw new Error('Response should contain data array');
          }
        });
    });

    it('GET /organizations/:id - Get organization by id', () => {
      return request(app.getHttpServer())
        .get(`/organizations/${organizationId}`)
        .expect(200)
        .expect((res) => {
          if (res.body.data.id !== organizationId) {
            throw new Error('Organization id mismatch');
          }
        });
    });

    it('PATCH /organizations/:id - Update organization', () => {
      return request(app.getHttpServer())
        .patch(`/organizations/${organizationId}`)
        .send({ name: 'Updated Organization' })
        .expect(200)
        .expect((res) => {
          if (res.body.data.name !== 'Updated Organization') {
            throw new Error('Organization update failed');
          }
        });
    });

    it('POST /organizations - Multiple organizations', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({ name: 'Another Organization', address: 'Ankara' })
        .expect(201);
    });

    it('POST /organizations - Reject empty name', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({ name: '' })
        .expect(400);
    });

    it('POST /organizations - Reject whitespace-only name', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send({ name: '   ' })
        .expect(400);
    });
  });

  describe('Projects', () => {
    it('POST /projects - Create project', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .send({
          name: 'Test Project',
          organizationId: organizationId,
        })
        .expect(201)
        .expect((res) => {
          projectId = res.body.data.id;
          if (!projectId || res.body.data.name !== 'Test Project') {
            throw new Error('Project creation failed');
          }
        });
    });

    it('GET /projects - List all projects', () => {
      return request(app.getHttpServer())
        .get('/projects')
        .expect(200)
        .expect((res) => {
          if (!Array.isArray(res.body.data)) {
            throw new Error('Response should contain data array');
          }
        });
    });

    it('GET /projects/:id - Get project by id', () => {
      return request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .expect(200)
        .expect((res) => {
          if (res.body.data.id !== projectId) {
            throw new Error('Project id mismatch');
          }
        });
    });

    it('PATCH /projects/:id - Update project', () => {
      return request(app.getHttpServer())
        .patch(`/projects/${projectId}`)
        .send({ name: 'Updated Project' })
        .expect(200)
        .expect((res) => {
          if (res.body.data.name !== 'Updated Project') {
            throw new Error('Project update failed');
          }
        });
    });

    it('PATCH /projects/:id - Update with name only', () => {
      return request(app.getHttpServer())
        .patch(`/projects/${projectId}`)
        .send({ name: 'Partially Updated Project' })
        .expect(200)
        .expect((res) => {
          if (res.body.data.name !== 'Partially Updated Project') {
            throw new Error('Project partial update failed');
          }
        });
    });

    it('PATCH /projects/:id - Invalid: non-existent project', () => {
      return request(app.getHttpServer())
        .patch('/projects/99999')
        .send({ name: 'test' })
        .expect(404);
    });
  });

  describe('Tasks', () => {
    it('POST /tasks - Create task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          projectId: projectId,
        })
        .expect(201)
        .expect((res) => {
          taskId = res.body.data.id;
          if (!taskId || res.body.data.title !== 'Test Task') {
            throw new Error('Task creation failed');
          }
        });
    });

    it('GET /tasks - List all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          if (!Array.isArray(res.body.data)) {
            throw new Error('Response should contain data array');
          }
        });
    });

    it('GET /tasks/:id - Get task by id', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200)
        .expect((res) => {
          if (res.body.data.id !== taskId) {
            throw new Error('Task id mismatch');
          }
        });
    });

    it('PATCH /tasks/:id - Update task', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ title: 'Updated Task' })
        .expect(200)
        .expect((res) => {
          if (res.body.data.title !== 'Updated Task') {
            throw new Error('Task update failed');
          }
        });
    });

    it('PATCH /tasks/:id - Foreign key validation should fail', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ projectId: 99999 })
        .expect(400);
    });

    it('PATCH /tasks/:id/move - Move task to another project', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .send({
          name: 'Target Project',
          organizationId: organizationId,
        })
        .then((res) => {
          const targetProjectId = res.body.data.id;
          return request(app.getHttpServer())
            .patch(`/tasks/${taskId}/move`)
            .send({ targetProjectId })
            .expect(200)
            .expect((resMove) => {
              if (!resMove.body.data.project || resMove.body.data.project.id !== targetProjectId) {
                throw new Error('Task move failed');
              }
            });
        });
    });

    it('POST /tasks - Multiple tasks', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Another Task', projectId: projectId })
        .expect(201);
    });

    it('PATCH /tasks/:id - Update with title only', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ title: 'Final Task Title' })
        .expect(200)
        .expect((res) => {
          if (res.body.data.title !== 'Final Task Title') {
            throw new Error('Task partial update failed');
          }
        });
    });

    it('PATCH /tasks/:id - Invalid: non-existent task', () => {
      return request(app.getHttpServer())
        .patch('/tasks/99999')
        .send({ title: 'test' })
        .expect(404);
    });

    it('POST /tasks - Reject empty title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: '', projectId: projectId })
        .expect(400);
    });

    it('POST /tasks - Reject whitespace-only title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({ title: '   ', projectId: projectId })
        .expect(400);
    });
  });

  describe('Cleanup', () => {
    it('DELETE /tasks/:id - Delete task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(200);
    });

    it('DELETE /projects/:id - Delete project', () => {
      return request(app.getHttpServer())
        .delete(`/projects/${projectId}`)
        .expect(200);
    });

    it('DELETE /organizations/:id - Delete organization', () => {
      return request(app.getHttpServer())
        .delete(`/organizations/${organizationId}`)
        .expect(200);
    });
  });
});
