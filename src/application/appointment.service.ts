import { randomUUID } from "node:crypto";

import type { AppointmentRepository } from "./ports/appointment.repository.js";
import {
  ConflictError,
  NotFoundError,
  applyAppointmentUpdate,
  buildAppointment,
  canonicalizeAppointmentId,
} from "../domain/index.js";
import type {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../domain/index.js";

export class AppointmentService {
  constructor(private readonly repository: AppointmentRepository) {}

  createAppointment(input: CreateAppointmentInput): Appointment {
    const appointment = buildAppointment(randomUUID(), input);

    this.ensureSlotIsAvailable(appointment);
    this.repository.create(appointment);

    return appointment;
  }

  getAppointment(id: string): Appointment | null {
    return this.repository.findById(canonicalizeAppointmentId(id));
  }

  listAppointments(): Appointment[] {
    return this.repository.findAll();
  }

  updateAppointment(id: string, changes: UpdateAppointmentInput): Appointment {
    const canonicalId = canonicalizeAppointmentId(id);
    const current = this.requireAppointment(canonicalId);
    const updated = applyAppointmentUpdate(current, changes);

    this.ensureSlotIsAvailable(updated, current.id);
    this.repository.replace(updated);

    return updated;
  }

  deleteAppointment(id: string): void {
    const canonicalId = canonicalizeAppointmentId(id);

    this.requireAppointment(canonicalId);
    this.repository.deleteById(canonicalId);
  }

  private requireAppointment(id: string): Appointment {
    const appointment = this.repository.findById(id);

    if (appointment === null) {
      throw new NotFoundError(`Appointment not found: ${id}`);
    }

    return appointment;
  }

  private ensureSlotIsAvailable(
    appointment: Appointment,
    ignoredAppointmentId?: string,
  ): void {
    const occupyingAppointment =
      this.repository.findByDoctorAndScheduledAt(
        appointment.doctorId,
        appointment.scheduledAt,
      );

    if (
      occupyingAppointment !== null &&
      occupyingAppointment.id !== ignoredAppointmentId
    ) {
      throw new ConflictError(
        `Doctor slot is already occupied: ${appointment.doctorId} at ${appointment.scheduledAt}`,
      );
    }
  }
}
