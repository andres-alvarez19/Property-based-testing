import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { AppointmentService } from "../../src/application/appointment.service.js";
import { InMemoryAppointmentRepository } from "../../src/infrastructure/in-memory-appointment.repository.js";
import { nonConflictingCreateAppointmentInputsArbitrary } from "../generators/appointment.arbitrary.js";

describe("PROP-DELETE-01", () => {
  it("makes only the selected appointment unreachable", () => {
    fc.assert(
      fc.property(
        nonConflictingCreateAppointmentInputsArbitrary,
        fc.nat(),
        (inputs, targetSeed) => {
          const repository = new InMemoryAppointmentRepository();
          const service = new AppointmentService(repository);
          const created = inputs.map((input) =>
            service.createAppointment(input),
          );
          const targetIndex = targetSeed % created.length;
          const target = created[targetIndex];
          if (target === undefined) {
            throw new Error("The generator must produce a deletion target");
          }
          const untouched = created.filter((_, index) => index !== targetIndex);

          service.deleteAppointment(target.id);

          expect(service.getAppointment(target.id)).toBeNull();
          expect(service.listAppointments()).toEqual(untouched);
          for (const appointment of untouched) {
            expect(service.getAppointment(appointment.id)).toEqual(appointment);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
