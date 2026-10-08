import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { AppointmentService } from "../../src/application/appointment.service.js";
import { canonicalizeUpdateAppointmentInput } from "../../src/domain/index.js";
import { InMemoryAppointmentRepository } from "../../src/infrastructure/in-memory-appointment.repository.js";
import {
  validCreateAppointmentInputArbitrary,
  validUpdateAppointmentInputArbitrary,
} from "../generators/appointment.arbitrary.js";

describe("PROP-UPDATE-01", () => {
  it("applies valid partial updates while preserving identity and status", () => {
    fc.assert(
      fc.property(
        validCreateAppointmentInputArbitrary,
        validUpdateAppointmentInputArbitrary,
        (input, changes) => {
          const repository = new InMemoryAppointmentRepository();
          const service = new AppointmentService(repository);
          const original = service.createAppointment(input);
          const canonicalChanges = canonicalizeUpdateAppointmentInput(changes);

          const updated = service.updateAppointment(original.id, changes);

          expect(updated).toEqual({
            ...original,
            ...canonicalChanges,
            id: original.id,
            status: "confirmed",
          });
          expect(updated.id).toBe(original.id);
          expect(service.getAppointment(original.id)).toEqual(updated);
          expect(service.listAppointments()).toEqual([updated]);
        },
      ),
      { numRuns: 100 },
    );
  });
});
