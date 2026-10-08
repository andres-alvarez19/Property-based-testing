import type { Appointment } from "../../domain/index.js";

export interface AppointmentRepository {
  create(appointment: Appointment): void;
  findById(id: string): Appointment | null;
  findAll(): Appointment[];
  replace(appointment: Appointment): void;
  deleteById(id: string): boolean;
  findByDoctorAndScheduledAt(
    doctorId: string,
    scheduledAt: string,
  ): Appointment | null;
}
