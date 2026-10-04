# Traceability Matrix

Estado inicial: los contratos están definidos; los archivos de implementación se completarán durante T01–T06.

| Requisito del laboratorio | Contrato | Implementación objetivo | Property test objetivo | Origen SmoothFlow | Estado |
|---|---|---|---|---|---|
| Entidad principal | DOMAIN §2 | `src/domain/appointment.ts` | Generadores Appointment | Citas / UC1–UC5 | Pendiente |
| Crear | DOMAIN §5 | `AppointmentService.createAppointment` | `PROP-CREATE-01` | RF-01, RF-02, RF-06 | Pendiente |
| Obtener por ID | DOMAIN §5 | `AppointmentService.getAppointment` | `PROP-READ-01` | Consulta de citas / UC5 | Pendiente |
| Listar | DOMAIN §5 | `AppointmentService.listAppointments` | cubierto complementariamente | Gestión de agenda / UC5 | Pendiente |
| Actualizar | DOMAIN §5 | `AppointmentService.updateAppointment` | `PROP-UPDATE-01` | RF-03, RF-08 / UC2, UC5 | Pendiente |
| Eliminar | DOMAIN D-07 | `AppointmentService.deleteAppointment` | `PROP-DELETE-01` | Simplificación del laboratorio | Pendiente |
| Evitar double booking | DOMAIN D-04 | validación en Application Service | `PROP-BOOKING-01` | RF-02, RF-06 / UC4 | Pendiente |
| Generación automática | TESTING | `tests/generators` | fast-check Arbitraries | Actividad PBT | Pendiente |
| API REST | API.openapi.yaml | `src/api` | tests de integración | Adaptación del laboratorio | Pendiente |
| CI | ACCEPTANCE §5 | `.github/workflows/ci.yml` | suite completa | Calidad de entrega | Pendiente |

## Completion rule

T09 debe reemplazar cada `Pendiente` por evidencia concreta y verificar que el nombre de los archivos coincida con la implementación real.
