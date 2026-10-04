# T09 — Delivery Hardening

## Role

Release/documentation agent.

## Depends on

T08 completed and CI green.

## Objective

Dejar el repositorio listo para evaluación académica y demostración.

## Read first

- `contracts/ACCEPTANCE.md`
- `VERIFICATION.md`
- `docs/TRACEABILITY.md`
- `README.md`

## Required work

### README

Actualizar con:

- objetivo del laboratorio;
- explicación breve de Property-Based Testing;
- stack;
- arquitectura;
- instalación;
- comandos;
- endpoints;
- propiedades implementadas;
- ejemplo de cómo fast-check genera múltiples entradas y hace shrinking;
- instrucciones para ejecutar la demo.

No presentar una prueba basada en ejemplos como si fuera PBT.

### Traceability

Actualizar `docs/TRACEABILITY.md` con rutas reales y estado final.

### Verification

Revisar que `VERIFICATION.md` coincida con el último estado del código.

## Final gate

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Confirmar además que GitHub Actions esté verde.

## Final academic checklist

El repositorio debe permitir demostrar rápidamente:

1. entidad Appointment;
2. CRUD;
3. regla real de dominio;
4. Arbitraries;
5. propiedad Create;
6. propiedad Read;
7. propiedad Update;
8. propiedad Delete;
9. propiedad double booking;
10. shrinking de fast-check;
11. suite verde;
12. trazabilidad.

## Codex prompt

```text
Complete T09_DELIVERY.md.

Do not redesign the implementation.
Harden the repository for academic evaluation:
update README, traceability and verification evidence to match the real code.

Run the complete gate one final time.
Ensure the documentation clearly distinguishes example-based tests
from property-based tests and explains the implemented invariants.
Do not modify contracts/.
```
