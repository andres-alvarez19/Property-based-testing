import { ValidationError } from "./errors.js";

export type AppointmentStatus = "confirmed";

export interface Appointment {
  readonly id: string;
  readonly patientId: string;
  readonly doctorId: string;
  readonly scheduledAt: string;
  readonly status: AppointmentStatus;
}

export interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  scheduledAt: string;
}

export interface UpdateAppointmentInput {
  patientId?: string;
  doctorId?: string;
  scheduledAt?: string;
}

const APPOINTMENT_STATUS: AppointmentStatus = "confirmed";
const MAX_IDENTIFIER_LENGTH = 64;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

const CREATE_FIELDS = new Set(["patientId", "doctorId", "scheduledAt"]);
const UPDATE_FIELDS = CREATE_FIELDS;

type UnknownRecord = Record<string, unknown>;

function requireRecord(value: unknown, label: string): UnknownRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ValidationError(`${label} must be an object`);
  }

  return value as UnknownRecord;
}

function rejectUnexpectedFields(
  value: UnknownRecord,
  allowedFields: ReadonlySet<string>,
): void {
  const unexpectedField = Object.keys(value).find(
    (field) => !allowedFields.has(field),
  );

  if (unexpectedField !== undefined) {
    throw new ValidationError(`Unexpected field: ${unexpectedField}`);
  }
}

function canonicalizeReferenceId(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string`);
  }

  const canonicalValue = value.trim();

  if (canonicalValue.length === 0) {
    throw new ValidationError(`${field} must not be empty`);
  }

  if (canonicalValue.length > MAX_IDENTIFIER_LENGTH) {
    throw new ValidationError(
      `${field} must contain at most ${String(MAX_IDENTIFIER_LENGTH)} characters`,
    );
  }

  return canonicalValue;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return isLeapYear ? 29 : 28;
  }

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function hasValidDateTimeParts(match: RegExpMatchArray): boolean {
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);

  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month) &&
    hour <= 23 &&
    minute <= 59 &&
    second <= 59
  );
}

export function canonicalizeAppointmentId(value: unknown): string {
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
    throw new ValidationError("id must be a valid UUID");
  }

  return value.toLowerCase();
}

export function canonicalizeScheduledAt(value: unknown): string {
  if (typeof value !== "string") {
    throw new ValidationError("scheduledAt must be an ISO-8601 date-time");
  }

  const match = value.match(ISO_DATE_TIME_PATTERN);
  if (match === null || !hasValidDateTimeParts(match)) {
    throw new ValidationError("scheduledAt must be an ISO-8601 date-time");
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new ValidationError("scheduledAt must be an ISO-8601 date-time");
  }

  return new Date(timestamp).toISOString();
}

export function canonicalizeCreateAppointmentInput(
  input: unknown,
): CreateAppointmentInput {
  const record = requireRecord(input, "CreateAppointmentInput");
  rejectUnexpectedFields(record, CREATE_FIELDS);

  return {
    patientId: canonicalizeReferenceId(record.patientId, "patientId"),
    doctorId: canonicalizeReferenceId(record.doctorId, "doctorId"),
    scheduledAt: canonicalizeScheduledAt(record.scheduledAt),
  };
}

export function canonicalizeUpdateAppointmentInput(
  input: unknown,
): UpdateAppointmentInput {
  const record = requireRecord(input, "UpdateAppointmentInput");
  rejectUnexpectedFields(record, UPDATE_FIELDS);

  const result: UpdateAppointmentInput = {};

  if (Object.hasOwn(record, "patientId")) {
    result.patientId = canonicalizeReferenceId(record.patientId, "patientId");
  }
  if (Object.hasOwn(record, "doctorId")) {
    result.doctorId = canonicalizeReferenceId(record.doctorId, "doctorId");
  }
  if (Object.hasOwn(record, "scheduledAt")) {
    result.scheduledAt = canonicalizeScheduledAt(record.scheduledAt);
  }

  if (Object.keys(result).length === 0) {
    throw new ValidationError(
      "UpdateAppointmentInput must contain at least one modifiable field",
    );
  }

  return result;
}

export function buildAppointment(
  id: unknown,
  input: unknown,
): Appointment {
  const canonicalInput = canonicalizeCreateAppointmentInput(input);

  return {
    id: canonicalizeAppointmentId(id),
    ...canonicalInput,
    status: APPOINTMENT_STATUS,
  };
}

export function applyAppointmentUpdate(
  appointment: Appointment,
  input: unknown,
): Appointment {
  const changes = canonicalizeUpdateAppointmentInput(input);

  return {
    ...appointment,
    ...changes,
    id: appointment.id,
    status: APPOINTMENT_STATUS,
  };
}
