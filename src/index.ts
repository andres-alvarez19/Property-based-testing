export { AppointmentService } from "./application/appointment.service.js";
export type { AppointmentRepository } from "./application/ports/appointment.repository.js";
export { createApp } from "./api/app.js";
export type { CreateAppOptions } from "./api/app.js";
export * from "./domain/index.js";
export { InMemoryAppointmentRepository } from "./infrastructure/in-memory-appointment.repository.js";
