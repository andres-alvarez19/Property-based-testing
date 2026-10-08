import fastify from "fastify";
import type { FastifyInstance } from "fastify";

import { AppointmentService } from "../application/appointment.service.js";
import {
  DomainError,
  NotFoundError,
} from "../domain/index.js";
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "../domain/index.js";
import { InMemoryAppointmentRepository } from "../infrastructure/in-memory-appointment.repository.js";

interface AppointmentParams {
  id: string;
}

interface CreateAppointmentRoute {
  Body: CreateAppointmentInput;
}

interface AppointmentByIdRoute {
  Params: AppointmentParams;
}

interface UpdateAppointmentRoute extends AppointmentByIdRoute {
  Body: UpdateAppointmentInput;
}

export interface CreateAppOptions {
  service?: AppointmentService;
}

const STATUS_BY_ERROR_CODE = {
  validation_error: 400,
  not_found: 404,
  conflict: 409,
} as const;

export function createApp(options: CreateAppOptions = {}): FastifyInstance {
  const app = fastify();
  const service =
    options.service ??
    new AppointmentService(new InMemoryAppointmentRepository());

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.status(STATUS_BY_ERROR_CODE[error.code]).send({
        error: error.code,
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      "statusCode" in error &&
      error.statusCode === 400
    ) {
      return reply.status(400).send({
        error: "validation_error",
        message: error.message,
      });
    }

    return reply.send(error);
  });

  app.post<CreateAppointmentRoute>("/appointments", (request, reply) => {
    const appointment = service.createAppointment(request.body);

    return reply.status(201).send(appointment);
  });

  app.get("/appointments", (_request, reply) => {
    return reply.status(200).send(service.listAppointments());
  });

  app.get<AppointmentByIdRoute>("/appointments/:id", (request, reply) => {
    const appointment = service.getAppointment(request.params.id);

    if (appointment === null) {
      throw new NotFoundError(
        `Appointment not found: ${request.params.id}`,
      );
    }

    return reply.status(200).send(appointment);
  });

  app.put<UpdateAppointmentRoute>("/appointments/:id", (request, reply) => {
    const appointment = service.updateAppointment(
      request.params.id,
      request.body,
    );

    return reply.status(200).send(appointment);
  });

  app.delete<AppointmentByIdRoute>(
    "/appointments/:id",
    (request, reply) => {
      service.deleteAppointment(request.params.id);

      return reply.status(204).send();
    },
  );

  return app;
}
