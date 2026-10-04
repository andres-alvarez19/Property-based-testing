# T05 — HTTP API

## Role

API adapter agent.

## Depends on

T04 completed.

## Objective

Exponer el service mediante Fastify respetando exactamente el contrato OpenAPI.

## Read first

- `AGENTS.md`
- `contracts/API.openapi.yaml`
- `contracts/DOMAIN.md`
- `contracts/ACCEPTANCE.md`

## Target

- `src/api/**`
- entrypoint/server wiring si corresponde;
- `tests/examples/**` para integración HTTP.

## Required endpoints

```text
POST   /appointments
GET    /appointments
GET    /appointments/:id
PUT    /appointments/:id
DELETE /appointments/:id
```

## HTTP mapping

- 201 Create success.
- 200 Read/List/Update success.
- 204 Delete success.
- 400 Validation.
- 404 Not Found.
- 409 Conflict.

Error response:

```json
{
  "error": "validation_error | not_found | conflict",
  "message": "..."
}
```

## Architecture

Crear preferentemente un app factory que pueda probarse con Fastify `inject` sin abrir un puerto real.

La API no duplica reglas de negocio: traduce HTTP <-> Application Service.

## Acceptance

Agregar pruebas de integración deterministas para los códigos principales.

Ejecutar:

```bash
npm run typecheck
npm run lint
npm test
```

## Codex prompt

```text
Implement task T05_HTTP_API.md.

Use contracts/API.openapi.yaml as the exact interface contract.
Build a testable Fastify adapter over AppointmentService.

Do not duplicate business rules inside routes.
Add deterministic API integration tests for success and 400/404/409 mappings.
Do not modify contracts/ or tasks/.

Run typecheck, lint and all tests.
```
