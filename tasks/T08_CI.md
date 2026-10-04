# T08 — GitHub Actions CI

## Role

CI agent.

## Depends on

T07 completed and green locally.

## Objective

Convertir el mismo gate local en un control automático de GitHub.

## Read first

- `AGENTS.md`
- `contracts/ACCEPTANCE.md`
- `VERIFICATION.md`

## Deliverable

Crear:

```text
.github/workflows/ci.yml
```

## Requirements

Workflow para:

- `pull_request`;
- push a `main`.

Usar una versión LTS soportada de Node compatible con el proyecto.

Pasos mínimos:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Usar cache de npm si resulta simple y correcto.

## Acceptance

- YAML válido.
- No duplicar lógica con scripts alternativos.
- CI usa exactamente los scripts del repositorio.
- El workflow debe quedar verde antes de T09.

## Codex prompt

```text
Implement T08_CI.md.

Create .github/workflows/ci.yml and run the same quality gate used locally:
npm ci
npm run typecheck
npm run lint
npm test
npm run build

Trigger on pull requests and pushes to main.
Do not modify contracts/ or tasks/.
```
