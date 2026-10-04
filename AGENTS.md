# AGENTS.md

## Project

Laboratorio de Property-Based Testing basado en una versión deliberadamente acotada del dominio de citas de SmoothFlow.

La entidad principal es `Appointment`. El objetivo académico es demostrar cómo invariantes del dominio pueden validarse para múltiples entradas generadas automáticamente mediante `fast-check`.

## Source of truth

Antes de implementar cualquier tarea, leer:

1. `contracts/DOMAIN.md`
2. `contracts/INVARIANTS.md`
3. `contracts/API.openapi.yaml`
4. `contracts/TESTING.md`
5. `contracts/ACCEPTANCE.md`
6. `docs/LAB_SCOPE.md`
7. el archivo de tarea correspondiente en `tasks/`

Los archivos bajo `contracts/` son la fuente de verdad.

**Una tarea de implementación no puede modificar los contratos.** Si se detecta una contradicción, detener la tarea y reportarla antes de cambiar código.

## Target architecture

```text
src/
├── domain/
├── application/
│   └── ports/
├── infrastructure/
└── api/

tests/
├── generators/
├── properties/
└── examples/
```

Responsabilidades:

- `src/domain`: tipos, entidades, validaciones y conceptos puros del dominio.
- `src/application`: casos de uso y reglas de negocio que coordinan el dominio.
- `src/application/ports`: interfaces que desacoplan la aplicación de infraestructura.
- `src/infrastructure`: implementaciones concretas, inicialmente repositorio in-memory.
- `src/api`: adaptador HTTP Fastify.
- `tests/generators`: Arbitraries reutilizables de fast-check.
- `tests/properties`: pruebas basadas en propiedades.
- `tests/examples`: pruebas deterministas complementarias; no reemplazan PBT.

## Engineering rules

- TypeScript con `strict: true`.
- Evitar `any`. Si fuese estrictamente necesario, debe justificarse localmente.
- El dominio no depende de Fastify.
- La aplicación no depende de una implementación concreta del repositorio.
- La API depende de la aplicación, no al revés.
- No usar `Math.random()` en tests.
- No desactivar shrinking en fast-check.
- Cada propiedad debe ejecutar con estado aislado.
- No introducir funcionalidades fuera de `docs/LAB_SCOPE.md`.
- No añadir WebSocket, autenticación, correo, UI ni base de datos real.
- No dejar tests con `.skip`, `.only` o equivalentes.
- No dejar TODO/FIXME en código entregable.

## Commands

A partir de T01 deben existir y permanecer operativos:

```bash
npm ci
npm run typecheck
npm run lint
npm test
```

## Factory workflow

Ejecutar las tareas en el orden descrito por `tasks/README.md`.

T05 y T06 solo pueden comenzar después de T04. Pueden desarrollarse en paralelo si se trabaja en ramas separadas y ambos respetan los contratos.

T07 actúa como verificador independiente y debe revisar la solución completa sin asumir que el código previo es correcto.

## Completion protocol

Al terminar una tarea:

1. ejecutar sus verificaciones;
2. revisar `contracts/ACCEPTANCE.md`;
3. informar archivos modificados;
4. informar comandos ejecutados y resultado;
5. no declarar la tarea terminada si queda un fallo conocido.
