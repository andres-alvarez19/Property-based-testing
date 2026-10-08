import type { FastifyInstance } from "fastify";
import { afterEach, describe, expect, it } from "vitest";

import { createApp } from "../../src/api/app.js";
import type { Appointment } from "../../src/domain/index.js";

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

const MISSING_ID = "550e8400-e29b-41d4-a716-446655440099";
const applications: FastifyInstance[] = [];

interface ErrorResponse {
  error: string;
  message: string;
}

function createTestApp(): FastifyInstance {
  const app = createApp();
  applications.push(app);
  return app;
}

afterEach(async () => {
  await Promise.all(applications.splice(0).map(async (app) => app.close()));
});

describe("Appointment HTTP API", () => {
  it("supports the successful CRUD flow with canonical response bodies", async () => {
    const app = createTestApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/appointments",
      payload: FIRST_INPUT,
    });

    expect(createResponse.statusCode).toBe(201);
    const created = createResponse.json<Appointment>();
    expect(created).toEqual({
      id: created.id,
      patientId: "patient-1",
      doctorId: "doctor-1",
      scheduledAt: "2026-10-20T10:00:00.000Z",
      status: "confirmed",
    });

    const getResponse = await app.inject({
      method: "GET",
      url: `/appointments/${created.id}`,
    });
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.json()).toEqual(created);

    const listResponse = await app.inject({
      method: "GET",
      url: "/appointments",
    });
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json()).toEqual([created]);

    const updateResponse = await app.inject({
      method: "PUT",
      url: `/appointments/${created.id}`,
      payload: {
        patientId: " patient-updated ",
        scheduledAt: "2026-10-22T12:30:00+02:30",
      },
    });
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json()).toEqual({
      ...created,
      patientId: "patient-updated",
      scheduledAt: "2026-10-22T10:00:00.000Z",
    });

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: `/appointments/${created.id}`,
    });
    expect(deleteResponse.statusCode).toBe(204);
    expect(deleteResponse.body).toBe("");

    const missingResponse = await app.inject({
      method: "GET",
      url: `/appointments/${created.id}`,
    });
    expect(missingResponse.statusCode).toBe(404);
    expect(missingResponse.json()).toEqual({
      error: "not_found",
      message: `Appointment not found: ${created.id}`,
    });
  });

  it("maps invalid create and update input to 400", async () => {
    const app = createTestApp();
    const invalidCreateResponse = await app.inject({
      method: "POST",
      url: "/appointments",
      payload: {
        patientId: "   ",
        doctorId: "doctor-1",
        scheduledAt: "2026-10-20T10:00:00Z",
      },
    });

    expect(invalidCreateResponse.statusCode).toBe(400);
    const createError = invalidCreateResponse.json<ErrorResponse>();
    expect(createError.error).toBe("validation_error");
    expect(typeof createError.message).toBe("string");

    const created = (
      await app.inject({
        method: "POST",
        url: "/appointments",
        payload: FIRST_INPUT,
      })
    ).json<Appointment>();
    const invalidUpdateResponse = await app.inject({
      method: "PUT",
      url: `/appointments/${created.id}`,
      payload: {},
    });

    expect(invalidUpdateResponse.statusCode).toBe(400);
    const updateError = invalidUpdateResponse.json<ErrorResponse>();
    expect(updateError.error).toBe("validation_error");
    expect(typeof updateError.message).toBe("string");
  });

  it.each([
    { method: "GET" as const },
    { method: "PUT" as const, payload: { patientId: "patient-2" } },
    { method: "DELETE" as const },
  ])("maps missing appointment on $method to 404", async (request) => {
    const response = await createTestApp().inject({
      ...request,
      url: `/appointments/${MISSING_ID}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json<ErrorResponse>()).toEqual({
      error: "not_found",
      message: `Appointment not found: ${MISSING_ID}`,
    });
  });

  it("maps a create double booking to 409 without replacing the first appointment", async () => {
    const app = createTestApp();
    const firstResponse = await app.inject({
      method: "POST",
      url: "/appointments",
      payload: FIRST_INPUT,
    });
    const first = firstResponse.json<Appointment>();

    const conflictResponse = await app.inject({
      method: "POST",
      url: "/appointments",
      payload: {
        patientId: "patient-2",
        doctorId: "doctor-1",
        scheduledAt: "2026-10-20T12:00:00+02:00",
      },
    });

    expect(conflictResponse.statusCode).toBe(409);
    const conflict = conflictResponse.json<ErrorResponse>();
    expect(conflict.error).toBe("conflict");
    expect(typeof conflict.message).toBe("string");

    const listResponse = await app.inject({
      method: "GET",
      url: "/appointments",
    });
    expect(listResponse.json()).toEqual([first]);
  });

  it("maps an update slot conflict to 409 without partial changes", async () => {
    const app = createTestApp();
    const occupied = (
      await app.inject({
        method: "POST",
        url: "/appointments",
        payload: FIRST_INPUT,
      })
    ).json<Appointment>();
    const original = (
      await app.inject({
        method: "POST",
        url: "/appointments",
        payload: SECOND_INPUT,
      })
    ).json<Appointment>();

    const response = await app.inject({
      method: "PUT",
      url: `/appointments/${original.id}`,
      payload: {
        patientId: "must-not-persist",
        doctorId: occupied.doctorId,
        scheduledAt: occupied.scheduledAt,
      },
    });

    expect(response.statusCode).toBe(409);
    const conflict = response.json<ErrorResponse>();
    expect(conflict.error).toBe("conflict");
    expect(typeof conflict.message).toBe("string");

    const originalResponse = await app.inject({
      method: "GET",
      url: `/appointments/${original.id}`,
    });
    expect(originalResponse.json()).toEqual(original);
  });
});
