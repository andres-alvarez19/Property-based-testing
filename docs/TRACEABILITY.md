# Traceability Matrix

Estado final revisado en T09 contra las rutas reales del repositorio. Los contratos permanecen sin modificaciones.

| Requisito | Fuente de verdad | Implementación real | Evidencia automatizada | Estado |
|---|---|---|---|:---:|
| Entidad `Appointment` y status fijo | DOMAIN §2, D-06 | `src/domain/appointment.ts` | `tests/examples/appointment.domain.test.ts`, `tests/properties/create.property.test.ts` | PASS |
| IDs UUID generados e inmutables | DOMAIN §3, D-05; PROP-ID-01 | `src/application/appointment.service.ts`, `src/domain/appointment.ts` | tests de domain/service; properties de Create y Update | PASS |
| Representación canónica | DOMAIN §3, D-01–D-03 | `src/domain/appointment.ts` | tests de domain/service/API; property de Create | PASS |
| Create | DOMAIN §5; PROP-CREATE-01 | `AppointmentService.createAppointment` | `tests/properties/create.property.test.ts` | PASS |
| Read por ID sin mutación | DOMAIN §5; PROP-READ-01 | `AppointmentService.getAppointment` | `tests/properties/read.property.test.ts` | PASS |
| List | DOMAIN §5 | `AppointmentService.listAppointments` | tests de repository/service/API y properties de Read/Delete | PASS |
| Update conserva identidad y campos omitidos | DOMAIN D-05–D-06; PROP-UPDATE-01 | `AppointmentService.updateAppointment` | `tests/properties/update.property.test.ts` | PASS |
| Delete físico | DOMAIN D-07; PROP-DELETE-01 | `AppointmentService.deleteAppointment` | `tests/properties/delete.property.test.ts` | PASS |
| Double booking normalizado | DOMAIN D-04; PROP-BOOKING-01 | `AppointmentService.ensureSlotIsAvailable` | `tests/properties/booking.property.test.ts`; tests de service/API | PASS |
| Fallos sin cambios parciales | DOMAIN §7; PROP-BOOKING-01, PROP-UPDATE-02 | validación y conflicto antes de `create`/`replace` | property de booking; tests deterministas de service/API | PASS |
| Sin mutación colateral | DOMAIN D-08; PROP-DELETE-02 | delete por ID y copias defensivas del repositorio | property de Delete; test de repository | PASS |
| Arbitraries reutilizables | TESTING §5–§6 | `tests/generators/appointment.arbitrary.ts` | consumidos por las seis `fc.property` | PASS |
| Cinco properties obligatorias | INVARIANTS §2–§3; TESTING §2 | `tests/properties/*.property.test.ts` | Create, Read, Update, Delete y Booking con `numRuns: 100` | PASS |
| Aislamiento y shrinking | TESTING §3–§4 | repositorio/servicio nuevos por caso; configuración por defecto de fast-check | seis `fc.assert`; sin seed fijo ni desactivación de shrinking | PASS |
| API REST y shape de errores | API.openapi.yaml | `src/api/app.ts` | `tests/examples/appointment.api.test.ts` | PASS |
| Límites entre capas | AGENTS.md | `src/domain`, `src/application`, `src/infrastructure`, `src/api` | typecheck, lint e inspección de imports | PASS |
| CI para push a `main` y pull requests | ACCEPTANCE §5 | `.github/workflows/ci.yml` | pasos `npm ci`, typecheck, lint, test y build | IMPLEMENTADO; SIN RUN REMOTO |
| Documentación final | ACCEPTANCE §6; T09 | `README.md`, `docs/TRACEABILITY.md`, `VERIFICATION.md` | revisión T09 contra código, pruebas y workflow | PASS |

## Cobertura académica

La demostración requerida queda trazada así:

1. Entidad, CRUD y regla real de dominio: `src/` y filas funcionales de la matriz.
2. Arbitraries: `tests/generators/appointment.arbitrary.ts`.
3. Properties Create, Read, Update, Delete y double booking: `tests/properties/`.
4. Shrinking: fast-check predeterminado, explicado en `README.md` y verificado sin opciones de desactivación.
5. Suite y build: comandos registrados en `VERIFICATION.md`.
6. Trazabilidad: esta matriz.

El workflow está listo localmente, pero la API pública de GitHub reportó **0 ejecuciones** al revisar T09. No puede declararse CI remoto verde hasta publicar estos cambios y obtener una ejecución exitosa.
