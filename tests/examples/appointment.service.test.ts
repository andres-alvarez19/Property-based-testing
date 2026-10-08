import { describe, expect, it } from "vitest";

import { AppointmentService } from "../../src/application/appointment.service.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../src/domain/index.js";
import { InMemoryAppointmentRepository } from "../../src/infrastructure/in-memory-appointment.repository.js";

const FIRST_INPUT = {
  patientId: " patient-1 ",
  doctorId: " doctor-1 ",
  scheduledAt: "2026-10-20T07:00:00-03:00",
};

const SECOND_INPUT = {
  patientId: "patient-2",
  doctorId: "doctor-2",
  scheduledAt: "2026-10-21T10:00:00Z",
};

function createService(): {
  repository: InMemoryAppointmentRepository;
  service: AppointmentService;
} {
  const repository = new InMemoryAppointmentRepository();
  return { repository, service: new AppointmentService(repository) };
}

describe("AppointmentService", () => {
  it("creates a canonical confirmed appointment and reads it by id", () => {
    const { service } = createService();

    const created = service.createAppointment(FIRST_INPUT);

    expect(created.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(created).toEqual({
      id: created.id,
      patientId: "patient-1",
      doctorId: "doctor-1",
      scheduledAt: "2026-10-20T10:00:00.000Z",
      status: "confirmed",
    });
    expect(service.getAppointment(created.id)).toEqual(created);
  });

  it("lists all persisted appointments", () => {
    const { service } = createService();
    const first = service.createAppointment(FIRST_INPUT);
    const second = service.createAppointment(SECOND_INPUT);

    expect(service.listAppointments()).toEqual([first, second]);
  });

  it("updates selected fields while preserving id, status, and omitted fields", () => {
    const { service } = createService();
    const created = service.createAppointment(FIRST_INPUT);

    const updated = service.updateAppointment(created.id, {
      patientId: " patient-updated ",
      scheduledAt: "2026-10-22T12:30:00+02:30",
    });

    expect(updated).toEqual({
      ...created,
      patientId: "patient-updated",
      scheduledAt: "2026-10-22T10:00:00.000Z",
    });
    expect(service.getAppointment(created.id)).toEqual(updated);
  });

  it("allows an appointment to retain its own occupied slot", () => {
    const { service } = createService();
    const created = service.createAppointment(FIRST_INPUT);

    expect(
      service.updateAppointment(created.id, { patientId: "patient-updated" }),
    ).toEqual({ ...created, patientId: "patient-updated" });
  });

  it("physically deletes only the target appointment", () => {
    const { service } = createService();
    const target = service.createAppointment(FIRST_INPUT);
    const untouched = service.createAppointment(SECOND_INPUT);

    service.deleteAppointment(target.id);

    expect(service.getAppointment(target.id)).toBeNull();
    expect(service.listAppointments()).toEqual([untouched]);
  });

  it("rejects a normalized double booking without changing persisted state", () => {
    const { service } = createService();
    const existing = service.createAppointment(FIRST_INPUT);

    expect(() =>
      service.createAppointment({
        patientId: "patient-2",
        doctorId: "doctor-1",
        scheduledAt: "2026-10-20T12:00:00+02:00",
      }),
    ).toThrow(ConflictError);
    expect(service.listAppointments()).toEqual([existing]);
  });

  it("rejects moving into another appointment's slot without partial changes", () => {
    const { service } = createService();
    const occupied = service.createAppointment(FIRST_INPUT);
    const original = service.createAppointment(SECOND_INPUT);

    expect(() =>
      service.updateAppointment(original.id, {
        patientId: "must-not-persist",
        doctorId: occupied.doctorId,
        scheduledAt: occupied.scheduledAt,
      }),
    ).toThrow(ConflictError);
    expect(service.getAppointment(occupied.id)).toEqual(occupied);
    expect(service.getAppointment(original.id)).toEqual(original);
  });

  it("rejects invalid mutations without changing persisted state", () => {
    const { service } = createService();
    const existing = service.createAppointment(FIRST_INPUT);

    expect(() =>
      service.updateAppointment(existing.id, { patientId: "   " }),
    ).toThrow(ValidationError);
    expect(service.getAppointment(existing.id)).toEqual(existing);
  });

  it("reports missing appointments for update and delete", () => {
    const { service } = createService();
    const missingId = "550e8400-e29b-41d4-a716-446655440099";

    expect(() =>
      service.updateAppointment(missingId, { patientId: "patient-2" }),
    ).toThrow(NotFoundError);
    expect(() => service.deleteAppointment(missingId)).toThrow(NotFoundError);
    expect(service.listAppointments()).toEqual([]);
  });
});
