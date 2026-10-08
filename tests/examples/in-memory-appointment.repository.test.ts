import { describe, expect, it } from "vitest";

import type { Appointment } from "../../src/domain/index.js";
import { InMemoryAppointmentRepository } from "../../src/infrastructure/in-memory-appointment.repository.js";

const FIRST_APPOINTMENT: Appointment = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  patientId: "patient-1",
  doctorId: "doctor-1",
  scheduledAt: "2026-10-20T10:00:00.000Z",
  status: "confirmed",
};

const SECOND_APPOINTMENT: Appointment = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  patientId: "patient-2",
  doctorId: "doctor-2",
  scheduledAt: "2026-10-21T10:00:00.000Z",
  status: "confirmed",
};

describe("InMemoryAppointmentRepository", () => {
  it("starts empty and keeps instances isolated", () => {
    const firstRepository = new InMemoryAppointmentRepository();
    const secondRepository = new InMemoryAppointmentRepository();

    firstRepository.create(FIRST_APPOINTMENT);

    expect(firstRepository.findAll()).toEqual([FIRST_APPOINTMENT]);
    expect(secondRepository.findAll()).toEqual([]);
  });

  it("creates, finds, replaces, and deletes appointments", () => {
    const repository = new InMemoryAppointmentRepository();
    const replacement: Appointment = {
      ...FIRST_APPOINTMENT,
      patientId: "patient-updated",
    };

    repository.create(FIRST_APPOINTMENT);
    repository.create(SECOND_APPOINTMENT);

    expect(repository.findById(FIRST_APPOINTMENT.id)).toEqual(FIRST_APPOINTMENT);
    expect(repository.findById("550e8400-e29b-41d4-a716-446655440099")).toBeNull();
    expect(repository.findAll()).toEqual([FIRST_APPOINTMENT, SECOND_APPOINTMENT]);

    repository.replace(replacement);

    expect(repository.findById(FIRST_APPOINTMENT.id)).toEqual(replacement);
    expect(repository.deleteById(FIRST_APPOINTMENT.id)).toBe(true);
    expect(repository.deleteById(FIRST_APPOINTMENT.id)).toBe(false);
    expect(repository.findAll()).toEqual([SECOND_APPOINTMENT]);
  });

  it("finds an appointment by its exact doctor and canonical schedule", () => {
    const repository = new InMemoryAppointmentRepository();
    repository.create(FIRST_APPOINTMENT);

    expect(
      repository.findByDoctorAndScheduledAt(
        FIRST_APPOINTMENT.doctorId,
        FIRST_APPOINTMENT.scheduledAt,
      ),
    ).toEqual(FIRST_APPOINTMENT);
    expect(
      repository.findByDoctorAndScheduledAt(
        FIRST_APPOINTMENT.doctorId,
        "2026-10-20T11:00:00.000Z",
      ),
    ).toBeNull();
  });

  it("does not expose mutable references to persisted appointments", () => {
    const repository = new InMemoryAppointmentRepository();
    const suppliedAppointment = { ...FIRST_APPOINTMENT };
    repository.create(suppliedAppointment);

    suppliedAppointment.patientId = "changed-after-create";
    const foundAppointment = repository.findById(FIRST_APPOINTMENT.id);
    if (foundAppointment === null) {
      throw new Error("Expected the persisted appointment to exist");
    }
    (foundAppointment as { patientId: string }).patientId = "changed-after-read";

    const listedAppointment = repository.findAll()[0];
    if (listedAppointment === undefined) {
      throw new Error("Expected the persisted appointment to be listed");
    }
    (listedAppointment as { patientId: string }).patientId = "changed-after-list";

    expect(repository.findById(FIRST_APPOINTMENT.id)).toEqual(FIRST_APPOINTMENT);
  });
});
