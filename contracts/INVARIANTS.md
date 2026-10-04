# Property Contract — Invariants

## 1. Objective

Las siguientes propiedades representan afirmaciones generales del sistema. Deben probarse mediante generación automática de datos y no mediante un conjunto fijo de ejemplos.

La notación `∀` significa "para toda entrada generada que satisfaga las precondiciones".

## 2. Required CRUD properties

### PROP-CREATE-01 — Create/Read round trip

Para todo `CreateAppointmentInput` válido y sin conflicto:

```text
∀ input válido:

created = createAppointment(input)

created.id != vacío
created.status = "confirmed"
getAppointment(created.id) = created
```

Además, los valores persistidos deben respetar la representación canónica definida en `DOMAIN.md`.

### PROP-READ-01 — Persisted entities are retrievable

Para toda secuencia válida de citas no conflictivas creada en un repositorio nuevo:

```text
∀ appointment creado:
getAppointment(appointment.id) = appointment
```

La lectura no puede modificar el repositorio.

Propiedad complementaria recomendada:

```text
∀ id UUID que no exista:
getAppointment(id) = null
```

### PROP-UPDATE-01 — Valid update preserves identity

Para toda cita existente y toda actualización válida que no produzca conflicto:

```text
original = createAppointment(input)
updated  = updateAppointment(original.id, changes)

updated.id = original.id
getAppointment(original.id) = updated
```

Los campos incluidos en `changes` deben reflejar el nuevo valor canónico. Los campos no incluidos deben conservar su valor anterior. `status` debe seguir siendo `"confirmed"`.

### PROP-DELETE-01 — Delete makes the entity unreachable

Para toda cita existente:

```text
created = createAppointment(input)
deleteAppointment(created.id)
getAppointment(created.id) = null
```

La eliminación no puede eliminar ni modificar otras citas.

## 3. Required domain property

### PROP-BOOKING-01 — No double booking

Para todo doctor, instante válido y dos pacientes distintos:

```text
first = createAppointment(patientA, doctor, scheduledAt)

createAppointment(patientB, doctor, scheduledAt)
=> ConflictError
```

Postcondiciones:

```text
solo existe una cita para doctor + scheduledAt
la primera cita permanece intacta
el repositorio no contiene una segunda cita conflictiva
```

Esta propiedad expresa la regla central de SmoothFlow vinculada a RF-02/RF-06 y UC4.

## 4. Additional high-value properties

### PROP-UPDATE-02 — Update cannot move into an occupied slot

Dadas dos citas no conflictivas A y B:

```text
updateAppointment(B.id, slot(A))
=> ConflictError
```

A y B deben quedar exactamente como estaban antes del intento.

### PROP-ID-01 — Generated IDs are unique

Para dos creaciones exitosas diferentes:

```text
first.id != second.id
```

### PROP-DELETE-02 — Delete has no collateral effects

Dadas varias citas válidas, `deleteAppointment(target.id)` debe eliminar solo `target`.

## 5. What is not a property

Esto es un ejemplo específico y no satisface por sí solo la actividad:

```ts
createAppointment({
  patientId: "P001",
  doctorId: "D001",
  scheduledAt: "2026-10-20T10:00:00.000Z"
});
```

La suite obligatoria debe formular las propiedades anteriores con `fc.property` o `fc.asyncProperty` y Arbitraries reutilizables.
