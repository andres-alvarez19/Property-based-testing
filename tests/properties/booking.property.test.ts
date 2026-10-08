import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { AppointmentService } from "../../src/application/appointment.service.js";
import { ConflictError } from "../../src/domain/index.js";
import { InMemoryAppointmentRepository } from "../../src/infrastructure/in-memory-appointment.repository.js";
import { conflictingAppointmentInputsArbitrary } from "../generators/appointment.arbitrary.js";

describe("PROP-BOOKING-01", () => {
  it("rejects double booking and leaves the first appointment intact", () => {
    fc.assert(
      fc.property(conflictingAppointmentInputsArbitrary, ({ first, second }) => {
        const repository = new InMemoryAppointmentRepository();
        const service = new AppointmentService(repository);
        const firstAppointment = service.createAppointment(first);

        expect(() => service.createAppointment(second)).toThrow(ConflictError);
        expect(service.getAppointment(firstAppointment.id)).toEqual(
          firstAppointment,
        );
        expect(service.listAppointments()).toEqual([firstAppointment]);
      }),
      { numRuns: 100 },
    );
  });
});
