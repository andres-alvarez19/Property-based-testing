# SmoothFlow — Property-Based Testing Lab

Laboratorio de **Property-Based Testing** aplicado a una versión acotada del dominio de citas de SmoothFlow.

## Estado actual

Este repositorio parte con un enfoque **contract-first**. En esta etapa se definen:

- alcance del laboratorio;
- contrato del dominio;
- invariantes que deben cumplirse para múltiples entradas generadas automáticamente;
- contrato HTTP mediante OpenAPI;
- contrato de testing y Definition of Done;
- backlog de tareas para ejecutar con Codex en modo fábrica agéntica.

La implementación de producción todavía no debe comenzar fuera del orden definido en `tasks/`.

## Stack objetivo

- Node.js
- TypeScript en modo estricto
- Fastify
- Vitest
- fast-check
- Persistencia en memoria
- Sin interfaz gráfica

## Entidad principal

`Appointment` (cita).

Operaciones mínimas:

- Create
- Read por ID y listado
- Update
- Delete

Regla de dominio principal: no pueden coexistir dos citas confirmadas para el mismo `doctorId` y `scheduledAt`.

## Fuente de verdad

Antes de implementar cualquier tarea, leer en este orden:

1. `AGENTS.md`
2. `contracts/DOMAIN.md`
3. `contracts/INVARIANTS.md`
4. `contracts/API.openapi.yaml`
5. `contracts/TESTING.md`
6. `contracts/ACCEPTANCE.md`
7. el archivo de tarea correspondiente en `tasks/`

Los contratos no deben modificarse como parte de una tarea de implementación. Cualquier cambio de contrato debe realizarse explícitamente antes de continuar con la fábrica.

## Flujo de implementación

```text
Contratos
   |
   v
T01 Bootstrap
   |
   v
T02 Domain
   |
   v
T03 Repository
   |
   v
T04 Application Service
   |
   +------------+
   |            |
   v            v
T05 API      T06 Property Tests
   |            |
   +------|-----+
          v
      T07 Verify
          |
          v
        T08 CI
          |
          v
      T09 Delivery
```

## Siguiente paso

Ejecutar `tasks/T01_BOOTSTRAP.md` con Codex. No avanzar a T02 hasta que T01 cumpla completamente su Definition of Done.
