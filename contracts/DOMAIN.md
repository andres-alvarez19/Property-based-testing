# Domain Contract — Appointment

## 1. Purpose

Este contrato define el modelo mínimo de dominio usado por el laboratorio. El sistema es una simplificación intencional de SmoothFlow y se centra exclusivamente en operaciones CRUD sobre citas.

## 2. Entity

### Appointment

```ts
type AppointmentStatus = "confirmed";

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status: AppointmentStatus;
}
```

### CreateAppointmentInput

```ts
interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  scheduledAt: string;
}
```

### UpdateAppointmentInput

```ts
interface UpdateAppointmentInput {
  patientId?: string;
  doctorId?: string;
  scheduledAt?: string;
}
```

`UpdateAppointmentInput` debe contener al menos un campo modificable.

## 3. Canonical representation

- `id`: identificador único generado por el sistema. Debe ser un UUID válido.
- `patientId`: string no vacío después de aplicar trim; máximo 64 caracteres.
- `doctorId`: string no vacío después de aplicar trim; máximo 64 caracteres.
- `scheduledAt`: fecha/hora ISO-8601 válida. La representación persistida debe normalizarse a UTC mediante formato equivalente a `Date.toISOString()`.
- `status`: en el alcance del laboratorio siempre es `"confirmed"`.

## 4. Domain rules

### D-01 — Patient required
Toda cita debe tener un `patientId` válido.

### D-02 — Doctor required
Toda cita debe tener un `doctorId` válido.

### D-03 — Valid schedule
`scheduledAt` debe representar una fecha/hora válida y serializable como ISO-8601.

### D-04 — Unique occupied slot

No pueden coexistir dos citas para el mismo par `doctorId + scheduledAt`, comparando `scheduledAt` después de normalización.

Si una creación o actualización produciría ese conflicto, la operación debe rechazarse sin alterar el estado persistido.

Esta regla deriva del comportamiento de SmoothFlow asociado a RF-02/RF-06 y UC4: validar disponibilidad e impedir double booking.

### D-05 — Immutable identifier
El `id` de una cita se asigna al crearla y no puede cambiar mediante Update.

### D-06 — Fixed status in lab scope
El estado no es modificable por Create ni Update. Toda cita existente en este laboratorio tiene `status = "confirmed"`.

### D-07 — Physical delete for the laboratory

Delete elimina físicamente la cita del repositorio. Después de una eliminación exitosa, una lectura por el mismo ID debe indicar ausencia.

Este comportamiento se adopta para cumplir literalmente el CRUD exigido por el laboratorio.

**Nota de alcance:** SmoothFlow completo modela la cancelación como transición a estado `"cancelada"` y liberación del bloque. Esa semántica queda fuera de este laboratorio.

### D-08 — No collateral mutation
Una operación sobre una cita no puede modificar o eliminar otras citas no objetivo.

## 5. Application operations

```text
createAppointment(input) -> Appointment
getAppointment(id) -> Appointment | null
listAppointments() -> Appointment[]
updateAppointment(id, changes) -> Appointment
deleteAppointment(id) -> void
```

## 6. Error categories

La implementación debe distinguir al menos:

- `ValidationError`: input inválido.
- `NotFoundError`: entidad objetivo inexistente para Update/Delete.
- `ConflictError`: el slot `doctorId + scheduledAt` ya está ocupado.

Los nombres concretos pueden variar siempre que la API pueda mapear inequívocamente estas categorías a los códigos HTTP definidos en OpenAPI.

## 7. Consistency

Si una operación falla por validación, conflicto o inexistencia, no debe dejar cambios parciales en el repositorio.
