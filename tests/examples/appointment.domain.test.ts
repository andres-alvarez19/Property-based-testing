import { describe, expect, it } from "vitest";

import {
  ConflictError,
  NotFoundError,
  ValidationError,
  applyAppointmentUpdate,
  buildAppointment,
  canonicalizeCreateAppointmentInput,
  canonicalizeScheduledAt,
  canonicalizeUpdateAppointmentInput,
} from "../../src/domain/index.js";

const APPOINTMENT_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("Appointment domain", () => {
  it("builds an appointment in its canonical representation", () => {
    const appointment = buildAppointment(APPOINTMENT_ID.toUpperCase(), {
      patientId: "  patient-1  ",
      doctorId: "  doctor-1  ",
      scheduledAt: "2026-10-20T07:00:00-03:00",
    });

    expect(appointment).toEqual({
      id: APPOINTMENT_ID,
      patientId: "patient-1",
      doctorId: "doctor-1",
      scheduledAt: "2026-10-20T10:00:00.000Z",
      status: "confirmed",
    });
  });

  it.each([
    { patientId: "", doctorId: "doctor-1", scheduledAt: "2026-10-20T10:00:00Z" },
    { patientId: "patient-1", doctorId: "   ", scheduledAt: "2026-10-20T10:00:00Z" },
    { patientId: "patient-1", doctorId: "doctor-1", scheduledAt: "not-a-date" },
    { patientId: "patient-1", doctorId: "doctor-1", scheduledAt: "2026-02-29T10:00:00Z" },
  ])("rejects invalid create input: $input", (input) => {
    expect(() => canonicalizeCreateAppointmentInput(input)).toThrow(ValidationError);
  });

  it("rejects identifiers longer than 64 characters after trimming", () => {
    expect(() =>
      canonicalizeCreateAppointmentInput({
        patientId: "p".repeat(65),
        doctorId: "doctor-1",
        scheduledAt: "2026-10-20T10:00:00Z",
      }),
    ).toThrow(ValidationError);
  });

  it("normalizes equivalent ISO-8601 instants to UTC", () => {
    expect(canonicalizeScheduledAt("2026-10-20T12:30:15.25+02:30")).toBe(
      "2026-10-20T10:00:15.250Z",
    );
  });

  it("requires at least one update field", () => {
    expect(() => canonicalizeUpdateAppointmentInput({})).toThrow(ValidationError);
  });

  it.each([{ id: APPOINTMENT_ID }, { status: "confirmed" }])(
    "rejects a non-modifiable update field: $input",
    (input) => {
      expect(() => canonicalizeUpdateAppointmentInput(input)).toThrow(
        ValidationError,
      );
    },
  );

  it("updates selected fields while preserving id and status", () => {
    const original = buildAppointment(APPOINTMENT_ID, {
      patientId: "patient-1",
      doctorId: "doctor-1",
      scheduledAt: "2026-10-20T10:00:00Z",
    });

    const updated = applyAppointmentUpdate(original, {
      patientId: " patient-2 ",
      scheduledAt: "2026-10-21T07:00:00-03:00",
    });

    expect(updated).toEqual({
      id: APPOINTMENT_ID,
      patientId: "patient-2",
      doctorId: "doctor-1",
      scheduledAt: "2026-10-21T10:00:00.000Z",
      status: "confirmed",
    });
    expect(original.patientId).toBe("patient-1");
  });

  it("exposes unambiguous domain error categories", () => {
    expect(new ValidationError("invalid").code).toBe("validation_error");
    expect(new NotFoundError("missing").code).toBe("not_found");
    expect(new ConflictError("occupied").code).toBe("conflict");
  });
});
