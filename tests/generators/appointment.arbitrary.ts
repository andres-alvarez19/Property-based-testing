import fc from "fast-check";

import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../../src/domain/index.js";

const MIN_SCHEDULE_TIMESTAMP = Date.parse("2020-01-01T00:00:00.000Z");
const MAX_SCHEDULE_TIMESTAMP = Date.parse("2035-12-31T23:59:59.999Z");

const identifierCharacterArbitrary = fc.constantFrom(
  ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_",
);

const referenceIdArbitrary = fc.string({
  unit: identifierCharacterArbitrary,
  minLength: 1,
  maxLength: 64,
});

const scheduledAtArbitrary = fc
  .integer({
    min: MIN_SCHEDULE_TIMESTAMP,
    max: MAX_SCHEDULE_TIMESTAMP,
  })
  .map((timestamp) => new Date(timestamp).toISOString());

export const validCreateAppointmentInputArbitrary: fc.Arbitrary<CreateAppointmentInput> =
  fc.record({
    patientId: referenceIdArbitrary,
    doctorId: referenceIdArbitrary,
    scheduledAt: scheduledAtArbitrary,
  });

export const validUpdateAppointmentInputArbitrary: fc.Arbitrary<UpdateAppointmentInput> =
  fc.oneof(
    fc.record({ patientId: referenceIdArbitrary }),
    fc.record({ doctorId: referenceIdArbitrary }),
    fc.record({ scheduledAt: scheduledAtArbitrary }),
    fc.record({
      patientId: referenceIdArbitrary,
      doctorId: referenceIdArbitrary,
    }),
    fc.record({
      patientId: referenceIdArbitrary,
      scheduledAt: scheduledAtArbitrary,
    }),
    fc.record({
      doctorId: referenceIdArbitrary,
      scheduledAt: scheduledAtArbitrary,
    }),
    fc.record({
      patientId: referenceIdArbitrary,
      doctorId: referenceIdArbitrary,
      scheduledAt: scheduledAtArbitrary,
    }),
  );

export const nonConflictingCreateAppointmentInputsArbitrary: fc.Arbitrary<
  CreateAppointmentInput[]
> = fc.uniqueArray(validCreateAppointmentInputArbitrary, {
  minLength: 1,
  maxLength: 8,
  selector: (input) => `${input.doctorId}|${input.scheduledAt}`,
});

export interface ConflictingAppointmentInputs {
  first: CreateAppointmentInput;
  second: CreateAppointmentInput;
}

export const conflictingAppointmentInputsArbitrary: fc.Arbitrary<ConflictingAppointmentInputs> =
  fc
    .tuple(
      fc.uniqueArray(referenceIdArbitrary, {
        minLength: 2,
        maxLength: 2,
      }),
      referenceIdArbitrary,
      scheduledAtArbitrary,
    )
    .map(([patients, doctorId, scheduledAt]) => {
      const [firstPatientId, secondPatientId] = patients;
      if (firstPatientId === undefined || secondPatientId === undefined) {
        throw new Error("The generator must produce two distinct patients");
      }

      return {
        first: { patientId: firstPatientId, doctorId, scheduledAt },
        second: { patientId: secondPatientId, doctorId, scheduledAt },
      };
    });

export const missingAppointmentIdArbitrary: fc.Arbitrary<string> = fc.uuid();
