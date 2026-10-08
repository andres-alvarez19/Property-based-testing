import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { AppointmentService } from "../../src/application/appointment.service.js";
import {
  canonicalizeAppointmentId,
  canonicalizeCreateAppointmentInput,
} from "../../src/domain/index.js";
import { InMemoryAppointmentRepository } from "../../src/infrastructure/in-memory-appointment.repository.js";
import { validCreateAppointmentInputArbitrary } from "../generators/appointment.arbitrary.js";

describe("PROP-CREATE-01", () => {
  it("persists every valid input in canonical form and reads it back", () => {
    fc.assert(
      fc.property(validCreateAppointmentInputArbitrary, (input) => {
        const repository = new InMemoryAppointmentRepository();
        const service = new AppointmentService(repository);

        const created = service.createAppointment(input);
        const canonicalInput = canonicalizeCreateAppointmentInput(input);

        expect(created.id).not.toBe("");
        expect(canonicalizeAppointmentId(created.id)).toBe(created.id);
        expect(created).toEqual({
          id: created.id,
          ...canonicalInput,
          status: "confirmed",
        });
        expect(service.getAppointment(created.id)).toEqual(created);
      }),
      { numRuns: 100 },
    );
  });
});
