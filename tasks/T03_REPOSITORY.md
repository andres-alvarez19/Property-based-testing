# T03 — Repository

## Role

Persistence boundary agent.

## Depends on

T02 completed.

## Objective

Crear el puerto de repositorio y una implementación in-memory determinista y fácil de aislar en tests.

## Read first

- `AGENTS.md`
- `contracts/DOMAIN.md`
- `contracts/ACCEPTANCE.md`

## Target files

Preferencia arquitectónica:

- `src/application/ports/appointment.repository.ts`
- `src/infrastructure/in-memory-appointment.repository.ts`

## Required repository capabilities

Debe permitir a Application Service implementar:

```text
save/create
findById
findAll
update/replace
delete
find slot by doctorId + scheduledAt
```

La interfaz concreta puede variar, pero no debe filtrar detalles internos como `Map` hacia Application.

## Rules

- Cada instancia nueva comienza vacía.
- Las lecturas no mutan estado.
- No exponer referencias mutables que permitan alterar entidades sin pasar por una operación explícita.
- La regla de negocio double booking se decide en T04; el repositorio debe ofrecer información suficiente para comprobarla.
- No HTTP.

## Acceptance

Ejecutar:

```bash
npm run typecheck
npm run lint
npm test
```

## Codex prompt

```text
Implement task T03_REPOSITORY.md.

Create an AppointmentRepository port and an isolated in-memory
implementation. Keep business conflict decisions out of infrastructure,
but provide a query that allows the application service to detect a
doctorId + scheduledAt collision.

Do not modify contracts/ or tasks/.
Run the full verification commands.
```
