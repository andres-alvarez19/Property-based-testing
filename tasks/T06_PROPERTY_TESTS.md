# T06 — Property-Based Tests

## Role

Property-testing specialist.

## Depends on

T04 completed. Puede ejecutarse en paralelo con T05.

## Objective

Implementar la evidencia principal del laboratorio mediante fast-check.

## Read first

- `AGENTS.md`
- `contracts/DOMAIN.md`
- `contracts/INVARIANTS.md`
- `contracts/TESTING.md`
- `contracts/ACCEPTANCE.md`

## Allowed scope

Principalmente:

- `tests/generators/**`
- `tests/properties/**`

Solo modificar producción si se descubre un defecto real necesario para que el sistema cumpla un contrato. En ese caso, documentar el defecto.

## Required generator module

Crear `tests/generators/appointment.arbitrary.ts` o equivalente con Arbitraries reutilizables para:

- Create válido;
- Update válido;
- colecciones no conflictivas;
- par conflictivo;
- UUID inexistente.

## Required property files

Como mínimo:

- `create.property.test.ts` -> PROP-CREATE-01
- `read.property.test.ts` -> PROP-READ-01
- `update.property.test.ts` -> PROP-UPDATE-01
- `delete.property.test.ts` -> PROP-DELETE-01
- `booking.property.test.ts` -> PROP-BOOKING-01

Propiedades adicionales recomendadas:

- PROP-UPDATE-02
- PROP-ID-01
- PROP-DELETE-02

## Hard constraints

- Usar `fc.assert(fc.property(...))` o `fc.asyncProperty`.
- `numRuns >= 100` por propiedad obligatoria.
- Shrinking habilitado.
- Sin Math.random.
- Sin entidades hardcodeadas como única entrada.
- Repositorio/service frescos por caso generado.
- Verificar estado después de errores, no solo que "lanza".

## Acceptance

Ejecutar:

```bash
npm run typecheck
npm run lint
npm test
```

El reporte final del agente debe indicar:

- properties implementadas;
- `numRuns` configurado;
- comandos ejecutados;
- resultado.

## Codex prompt

```text
Implement task T06_PROPERTY_TESTS.md.

You are the property-testing specialist.
You may work mainly under tests/generators and tests/properties.

Implement:
PROP-CREATE-01
PROP-READ-01
PROP-UPDATE-01
PROP-DELETE-01
PROP-BOOKING-01

Use fast-check with at least 100 runs for every required property.
Keep shrinking enabled.
Use fresh repository/service state for each generated case.
Do not replace properties with example tests.
Do not use Math.random or fc.sample as a substitute for properties.

Do not modify contracts/ or tasks/.
Run typecheck, lint and the complete test suite.
Report property count, numRuns and results.
```
