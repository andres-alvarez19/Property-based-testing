import type { AppointmentRepository } from "../application/ports/appointment.repository.js";
import type { Appointment } from "../domain/index.js";

function copyAppointment(appointment: Appointment): Appointment {
  return { ...appointment };
}

export class InMemoryAppointmentRepository implements AppointmentRepository {
  private readonly appointments = new Map<string, Appointment>();

  create(appointment: Appointment): void {
    this.appointments.set(appointment.id, copyAppointment(appointment));
  }

  findById(id: string): Appointment | null {
    const appointment = this.appointments.get(id);

    return appointment === undefined ? null : copyAppointment(appointment);
  }

  findAll(): Appointment[] {
    return Array.from(this.appointments.values(), copyAppointment);
  }

  replace(appointment: Appointment): void {
    this.appointments.set(appointment.id, copyAppointment(appointment));
  }

  deleteById(id: string): boolean {
    return this.appointments.delete(id);
  }

  findByDoctorAndScheduledAt(
    doctorId: string,
    scheduledAt: string,
  ): Appointment | null {
    const appointment = Array.from(this.appointments.values()).find(
      (candidate) =>
        candidate.doctorId === doctorId &&
        candidate.scheduledAt === scheduledAt,
    );

    return appointment === undefined ? null : copyAppointment(appointment);
  }
}
