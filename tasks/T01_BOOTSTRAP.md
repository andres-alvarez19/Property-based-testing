# T01 — Bootstrap

## Role

Bootstrap agent.

## Objective

Inicializar el proyecto Node.js + TypeScript sin implementar todavía comportamiento de negocio.

## Read first

- `AGENTS.md`
- `contracts/TESTING.md`
- `contracts/ACCEPTANCE.md`
- `docs/LAB_SCOPE.md`

## Allowed scope

Puede crear/modificar configuración raíz, lockfile y un entrypoint mínimo.

No modificar:

- `contracts/**`
- `tasks/**`

No implementar Appointment todavía.

## Requirements

1. Crear `package.json`.
2. TypeScript con `strict: true`.
3. Configurar ESLint para TypeScript.
4. Configurar Vitest.
5. Instalar `fast-check`.
6. Incluir Fastify para la etapa API.
7. Crear scripts:
   - `typecheck`
   - `lint`
   - `test`
   - `build`
8. Generar y versionar `package-lock.json`.
9. Crear un entrypoint mínimo compilable si fuese necesario, sin lógica de negocio.

## Acceptance

Deben pasar:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

No debe existir aún lógica CRUD de Appointment.

## Codex prompt

```text
Implement task T01_BOOTSTRAP.md.

Read AGENTS.md, contracts/TESTING.md, contracts/ACCEPTANCE.md
and docs/LAB_SCOPE.md before changing files.

Initialize the TypeScript project with Fastify, Vitest and fast-check.
Enable strict TypeScript and ESLint.

Create the required scripts and lockfile.
Do not implement Appointment domain behavior.
Do not modify contracts/ or tasks/.

Run:
npm ci
npm run typecheck
npm run lint
npm test
npm run build

Return the files changed and exact command results.
```
