export {
  applyAppointmentUpdate,
  buildAppointment,
  canonicalizeAppointmentId,
  canonicalizeCreateAppointmentInput,
  canonicalizeScheduledAt,
  canonicalizeUpdateAppointmentInput,
} from "./appointment.js";
export type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.js";
export {
  ConflictError,
  DomainError,
  NotFoundError,
  ValidationError,
} from "./errors.js";
