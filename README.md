# SmoothFlow — Property-Based Testing Lab

Laboratorio académico de **Property-Based Testing (PBT)** aplicado a una versión deliberadamente acotada del dominio de citas de SmoothFlow. Su objetivo es demostrar que invariantes del dominio pueden comprobarse para muchas entradas generadas automáticamente, no solo para unos pocos casos elegidos a mano.

La entidad central es `Appointment`. El sistema ofrece CRUD completo y aplica una regla real de negocio: no pueden coexistir dos citas para el mismo `doctorId` y el mismo instante `scheduledAt`, una vez normalizado a UTC.

## Property-Based Testing

Una prueba basada en ejemplos valida escenarios concretos, por ejemplo, que una cita fija se crea con HTTP 201. Esas pruebas viven en `tests/examples/` y complementan la suite.

Una property expresa una afirmación general. fast-check genera datos variables mediante **Arbitraries** y ejecuta la afirmación 100 veces. Por ejemplo, `PROP-CREATE-01` recibe distintos pacientes, médicos e instantes válidos y comprueba en cada ejecución que Create/Read conserva la representación canónica.

Si fast-check encuentra un fallo, aplica **shrinking**: intenta reducir automáticamente la entrada que lo causó hasta obtener un contraejemplo más pequeño y fácil de diagnosticar. La suite mantiene el shrinking predeterminado habilitado y el reporte de fallo incluye `seed` y `path`, útiles para reproducir el caso.

Forma simplificada del patrón usado en el repositorio:

```ts
fc.assert(
  fc.property(validCreateAppointmentInputArbitrary, (input) => {
    const repository = new InMemoryAppointmentRepository();
    const service = new AppointmentService(repository);
    const created = service.createAppointment(input);

    expect(service.getAppointment(created.id)).toEqual(created);
  }),
  { numRuns: 100 },
);
```

Este código representa PBT porque `input` se genera para cada caso. En cambio, una llamada con un único objeto literal es una prueba basada en ejemplos.

## Stack

- Node.js y npm.
- TypeScript con `strict: true`.
- Fastify para el adaptador HTTP.
- Vitest como test runner.
- fast-check para generación, ejecución de properties y shrinking.
- Repositorio in-memory como persistencia del laboratorio.
- GitHub Actions para el quality gate de CI.

## Arquitectura

```text
src/
├── domain/          # tipos, validación, canonicalización y errores
├── application/     # servicio de aplicación y puerto del repositorio
├── infrastructure/  # implementación in-memory del repositorio
└── api/             # adaptador HTTP Fastify

tests/
├── generators/      # Arbitraries reutilizables de fast-check
├── properties/      # pruebas basadas en propiedades
└── examples/        # pruebas deterministas complementarias
```

El dominio no depende de Fastify; la aplicación depende del puerto `AppointmentRepository`, y la infraestructura implementa ese puerto. Los archivos bajo `contracts/` son la fuente de verdad.

## Instalación

Requisitos:

- Node.js `^22.13.0`, `^24.0.0` o `>=26.0.0`.
- npm y el lockfile versionado.

```bash
git clone git@github.com:andres-alvarez19/Property-based-testing.git
cd Property-based-testing
npm ci
```

## Comandos

```bash
npm run typecheck  # valida TypeScript sin emitir archivos
npm run lint       # ejecuta ESLint
npm test           # ejecuta ejemplos y properties
npm run build      # compila producción en dist/
```

Quality gate completo:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

## API

`createApp()` construye la aplicación Fastify con un repositorio in-memory aislado. La integración HTTP se comprueba mediante `Fastify.inject`, sin abrir un puerto de red.

| Método | Ruta | Éxito | Operación |
|---|---|---:|---|
| `POST` | `/appointments` | 201 | Crear una cita |
| `GET` | `/appointments` | 200 | Listar citas |
| `GET` | `/appointments/:id` | 200 | Obtener una cita |
| `PUT` | `/appointments/:id` | 200 | Actualizar una cita |
| `DELETE` | `/appointments/:id` | 204 | Eliminar físicamente una cita |

Los errores de validación, entidad inexistente y slot ocupado se mapean respectivamente a 400, 404 y 409. El contrato completo está en `contracts/API.openapi.yaml`.

## Properties implementadas

| Property | Invariante comprobada |
|---|---|
| `PROP-CREATE-01` | Create/Read round trip, UUID, estado y representación canónica. |
| `PROP-READ-01` | Entidades persistidas recuperables; Read no muta el estado. |
| `PROP-UPDATE-01` | Update conserva ID, status y campos omitidos. |
| `PROP-DELETE-01` | Delete hace inalcanzable solo la cita objetivo. |
| `PROP-BOOKING-01` | Double booking se rechaza y la primera cita permanece intacta. |

Cada property obligatoria usa `fc.property`, ejecuta `numRuns: 100` y crea un repositorio y servicio nuevos dentro de cada caso generado. Existe además una property complementaria para UUID inexistente.

Los Arbitraries reutilizables de `tests/generators/appointment.arbitrary.ts` generan inputs Create, updates parciales, colecciones no conflictivas, pares conflictivos y UUIDs válidos. Las fechas usan un rango estable entre 2020 y 2035 y no dependen del reloj del sistema.

## Ejecutar la demo

Para una demostración rápida y legible:

```bash
# 1. Ver la property central de double booking (100 entradas generadas)
npm test -- tests/properties/booking.property.test.ts --reporter=verbose

# 2. Ver las seis properties de CRUD y dominio
npm test -- tests/properties --reporter=verbose

# 3. Ver el flujo HTTP y los códigos 400/404/409
npm test -- tests/examples/appointment.api.test.ts --reporter=verbose

# 4. Cerrar con el gate completo
npm run typecheck && npm run lint && npm test && npm run build
```

La primera ejecución demuestra la regla de dominio con valores generados. La segunda cubre Create, Read, Update, Delete y booking. La tercera es deliberadamente example-based: verifica el adaptador HTTP con escenarios deterministas y no sustituye a las properties.

## Evidencia

- `docs/TRACEABILITY.md`: matriz final entre contratos, implementación y pruebas.
- `VERIFICATION.md`: verificación independiente, gate final y estado de CI.
- `.github/workflows/ci.yml`: quality gate para cada pull request y push a `main`.

El alcance excluye UI, autenticación, WebSocket, correo, base de datos real y cualquier funcionalidad no definida en `docs/LAB_SCOPE.md`.
