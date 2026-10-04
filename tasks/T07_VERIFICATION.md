# T07 — Independent Verification

## Role

Independent verifier / quality gate.

## Depends on

T05 and T06 completed.

## Objective

Auditar la implementación contra los contratos sin asumir que los agentes anteriores trabajaron correctamente.

## Read first

Leer **todos** los archivos bajo `contracts/` y `AGENTS.md`.

## Verification checklist

Comprobar explícitamente:

1. CRUD completo.
2. Create tiene PBT real.
3. Read tiene PBT real.
4. Update tiene PBT real.
5. Delete tiene PBT real.
6. Existe PROP-BOOKING-01.
7. fast-check genera entradas variables.
8. `numRuns >= 100`.
9. shrinking no está deshabilitado.
10. cada property usa estado aislado.
11. no se usa Math.random.
12. double booking no deja dos citas persistidas.
13. update conflictivo no deja cambios parciales.
14. Delete no afecta otras citas.
15. API coincide con OpenAPI.
16. 400/404/409 están correctamente mapeados.
17. no hay tests skip/only.
18. no hay funcionalidad fuera de alcance.
19. dependencias entre capas son correctas.
20. documentación no afirma algo que el código no haga.

## Execution

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

## Defect policy

Si se encuentra un defecto pequeño y no ambiguo:

- corregir la mínima superficie necesaria;
- no modificar contratos;
- volver a ejecutar la verificación completa.

Si corregirlo exige reinterpretar un contrato, detenerse y reportarlo en vez de inventar una regla.

## Deliverable

Crear `VERIFICATION.md` con:

- commit/estado revisado;
- checklist PASS/FAIL;
- comandos;
- cantidad de property tests;
- evidencia de `numRuns`;
- defectos encontrados y correcciones;
- resultado final.

## Codex prompt

```text
Act as the independent verifier for T07_VERIFICATION.md.

Do not assume the implementation is correct.
Read every contract and inspect the complete codebase.

Run npm ci, typecheck, lint, tests and build.
Verify all 20 checklist items.

Fix only small unambiguous implementation defects, never contracts.
After any fix, rerun the full gate.

Create VERIFICATION.md with auditable evidence.
```
