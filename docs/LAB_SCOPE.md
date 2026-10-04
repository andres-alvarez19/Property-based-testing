# Laboratory Scope

## 1. Context

El laboratorio reutiliza una fracción controlada del dominio de **SmoothFlow**, sistema de agendamiento clínico.

En el proyecto original, SmoothFlow define reglas relacionadas con:

- reservar citas;
- verificar disponibilidad antes de confirmar;
- reagendar a un nuevo bloque;
- cancelar citas;
- evitar double booking.

Los requisitos de referencia más relevantes son RF-01, RF-02, RF-03, RF-04 y RF-06, junto con UC1, UC2, UC3, UC4 y UC5.

## 2. Goal of this laboratory

Implementar una entidad de dominio simple que exceda un CRUD trivial mediante al menos una regla real del dominio, y demostrar su comportamiento con Property-Based Testing.

La entidad elegida es:

```text
Appointment
```

## 3. In scope

- Create Appointment.
- Read Appointment por ID.
- List Appointments.
- Update Appointment.
- Delete Appointment.
- Validación de campos.
- Identificador generado por el sistema.
- Unicidad de `doctorId + scheduledAt`.
- Rechazo de double booking.
- API REST mínima.
- Repositorio in-memory.
- Pruebas basadas en propiedades con fast-check.
- Pruebas deterministas complementarias.
- CI.

## 4. Explicitly out of scope

- Frontend.
- Autenticación/autorización.
- Pacientes, médicos o usuarios como entidades CRUD independientes.
- WebSocket/WSS.
- Correo transaccional.
- PostgreSQL u otra base de datos real.
- Docker como requisito de laboratorio.
- Reportes.
- Historias clínicas.
- Integraciones FONASA/ISAPRE/HL7.
- Concurrencia real a nivel de base de datos.
- Cancelación con estado histórico.
- Auditoría legal del sistema completo.

## 5. Deliberate simplification: Delete

SmoothFlow completo conserva una cita cancelada con estado `"cancelada"` y libera su bloque.

El enunciado de este laboratorio exige una operación **Eliminar**. Para hacer inequívoco el cumplimiento, el laboratorio implementa Delete físico.

Esta simplificación no pretende modificar el diseño original de SmoothFlow; solo delimita el ejercicio académico.

## 6. Property-Based Testing focus

La entrega debe demostrar la diferencia entre:

```text
probar algunos ejemplos concretos
```

y:

```text
expresar propiedades que deben cumplirse para muchas entradas
generadas automáticamente
```

La propiedad de mayor valor de dominio será la imposibilidad de double booking.
