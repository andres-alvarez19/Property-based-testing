# T02 — Domain

## Role

Domain agent.

## Depends on

T01 completed.

## Objective

Implementar el modelo puro de Appointment y sus validaciones locales.

## Read first

- `AGENTS.md`
- `contracts/DOMAIN.md`
- `contracts/INVARIANTS.md`
- `contracts/ACCEPTANCE.md`

## Allowed scope

Principalmente:

- `src/domain/**`
- pruebas deterministas de dominio en `tests/examples/**` si aportan valor.

No implementar HTTP, repositorio concreto ni service orchestration.

## Requirements

1. Definir `Appointment`, `CreateAppointmentInput` y `UpdateAppointmentInput`.
2. Representar `status = "confirmed"`.
3. Implementar validación/canonicalización de patientId, doctorId y scheduledAt.
4. Proveer errores tipados para Validation, Not Found y Conflict, o estructura equivalente inequívoca.
5. Evitar que Update pueda modificar `id` o `status`.

La regla de double booking necesita estado y se aplicará en T04, no dentro de una entidad aislada.

## Acceptance

- Tipado estricto.
- Dominio sin dependencia de Fastify.
- Fechas normalizadas.
- Inputs inválidos rechazables de forma inequívoca.

Ejecutar:

```bash
npm run typecheck
npm run lint
npm test
```

## Codex prompt

```text
Implement task T02_DOMAIN.md.

Treat contracts/DOMAIN.md as authoritative.
Implement only the pure Appointment domain and local validation.
Do not implement persistence or HTTP.
Do not modify contracts/ or tasks/.

Run typecheck, lint and tests before finishing.
Report changed files and results.
```
