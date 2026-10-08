import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { AppointmentService } from "../../src/application/appointment.service.js";
import { InMemoryAppointmentRepository } from "../../src/infrastructure/in-memory-appointment.repository.js";
import {
  missingAppointmentIdArbitrary,
  nonConflictingCreateAppointmentInputsArbitrary,
} from "../generators/appointment.arbitrary.js";

describe("PROP-READ-01", () => {
  it("retrieves every appointment in a non-conflicting sequence without mutation", () => {
    fc.assert(
      fc.property(nonConflictingCreateAppointmentInputsArbitrary, (inputs) => {
        const repository = new InMemoryAppointmentRepository();
        const service = new AppointmentService(repository);
        const created = inputs.map((input) =>
          service.createAppointment(input),
        );
        const stateBeforeReads = service.listAppointments();

        for (const appointment of created) {
          expect(service.getAppointment(appointment.id)).toEqual(appointment);
        }

        expect(service.listAppointments()).toEqual(stateBeforeReads);
      }),
      { numRuns: 100 },
    );
  });

  it("returns null for a valid UUID in an empty repository", () => {
    fc.assert(
      fc.property(missingAppointmentIdArbitrary, (missingId) => {
        const repository = new InMemoryAppointmentRepository();
        const service = new AppointmentService(repository);

        expect(service.getAppointment(missingId)).toBeNull();
        expect(service.listAppointments()).toEqual([]);
      }),
      { numRuns: 100 },
    );
  });
});
