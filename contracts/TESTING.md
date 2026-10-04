# Testing Contract

## 1. Tooling

La suite utilizará:

- Vitest como test runner.
- fast-check como framework de Property-Based Testing.

Las pruebas basadas en propiedades se ejecutarán principalmente contra la capa de aplicación y un repositorio in-memory aislado. La API HTTP tendrá pruebas de integración deterministas complementarias.

## 2. Minimum property suite

Son obligatorias:

- `PROP-CREATE-01`
- `PROP-READ-01`
- `PROP-UPDATE-01`
- `PROP-DELETE-01`
- `PROP-BOOKING-01`

Deben mantener los mismos IDs definidos en `contracts/INVARIANTS.md`.

## 3. fast-check configuration

Cada propiedad obligatoria debe ejecutarse con `numRuns >= 100`.

Reglas:

- Shrinking debe permanecer habilitado.
- No fijar un seed permanente como mecanismo para ocultar inestabilidad.
- Si ocurre un fallo, conservar seed/path cuando sea útil para reproducirlo.
- No usar `Math.random()`.
- No reemplazar `fc.assert(fc.property(...))` por un loop manual.
- No usar `fc.sample()` como sustituto de una property.

## 4. Isolation

Cada ejecución de una propiedad debe partir de estado controlado:

```text
generated case
   -> new InMemoryAppointmentRepository()
   -> new AppointmentService(repository)
   -> assertions
```

Una propiedad no puede depender del orden de ejecución de otra.

## 5. Required Arbitraries

`tests/generators/appointment.arbitrary.ts` debe exponer Arbitraries reutilizables equivalentes a:

- `CreateAppointmentInput` válido;
- `UpdateAppointmentInput` válido;
- colección de citas no conflictivas;
- par de inputs conflictivos con igual `doctorId + scheduledAt`;
- UUIDs válidos para inexistencia.

Los generadores deben respetar `DOMAIN.md`.

## 6. Generator design

Debe existir variación real en paciente, médico, fecha/hora y updates parciales.

Evitar filtros excesivos que degraden shrinking. Cuando sea posible, construir datos válidos por diseño.

Para fechas, usar un rango fijo y estable y convertir a ISO-8601 UTC, evitando depender de la fecha actual del sistema.

## 7. Assertions

Verificar estado observable, no detalles privados de implementación:

- igualdad del objeto recuperado;
- conservación del ID;
- ausencia después de Delete;
- rechazo de double booking;
- ausencia de cambios parciales tras conflicto.

## 8. Deterministic tests

`tests/examples/` puede complementar con pruebas tradicionales para validación, códigos 400/404/409, shape de respuestas y endpoints. Nunca reemplazan PBT.

## 9. Required commands

```bash
npm run typecheck
npm run lint
npm test
```

La entrega final debe pasar los tres sin errores.
