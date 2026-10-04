# T04 — Application Service

## Role

Business rules agent.

## Depends on

T03 completed.

## Objective

Implementar el CRUD completo y hacer cumplir los invariantes de negocio.

## Read first

- `AGENTS.md`
- `contracts/DOMAIN.md`
- `contracts/INVARIANTS.md`
- `contracts/ACCEPTANCE.md`

## Target

`src/application/appointment.service.ts` o estructura equivalente cohesionada.

## Required operations

- `createAppointment(input)`
- `getAppointment(id)`
- `listAppointments()`
- `updateAppointment(id, changes)`
- `deleteAppointment(id)`

## Required behavior

### Create

- validar/canonicalizar;
- generar UUID;
- status confirmed;
- rechazar slot ocupado;
- persistir solo si todo es válido.

### Read

- devolver entidad exacta o `null` según DOMAIN.

### Update

- requerir entidad existente;
- conservar ID;
- aplicar solo campos permitidos;
- validar resultado final;
- rechazar conflicto con otra cita;
- una cita no debe colisionar consigo misma al conservar su propio slot.

### Delete

- requerir entidad existente;
- eliminar solo la entidad objetivo.

### Atomic observable behavior

Un ValidationError, NotFoundError o ConflictError no debe dejar cambios parciales.

## Acceptance

El servicio debe ser independiente de Fastify y depender del repository port.

Ejecutar:

```bash
npm run typecheck
npm run lint
npm test
```

## Codex prompt

```text
Implement task T04_APPLICATION_SERVICE.md.

Read DOMAIN.md and INVARIANTS.md carefully.
Implement all CRUD use cases in the application service.

The central invariant is uniqueness of normalized
doctorId + scheduledAt.

Failed operations must not mutate persisted state.
Do not implement HTTP yet.
Do not modify contracts/ or tasks/.

Run typecheck, lint and tests and report results.
```
