# Factory Backlog

Cada archivo TXX constituye una orden de trabajo para Codex.

## Rules

- Ejecutar una tarea por vez, salvo T05 y T06, que pueden desarrollarse en paralelo después de T04.
- Cada agente debe leer `AGENTS.md` y los contratos indicados en su tarea.
- Los agentes no pueden modificar `contracts/`.
- Una tarea no se marca completa si fallan `typecheck`, `lint` o `test` una vez que dichos comandos existan.
- Preferir una rama/PR por tarea si se trabaja realmente con agentes en paralelo.

## Estado actual

T01–T09 completadas y publicadas en `main`. La ejecución remota de GitHub Actions para el commit `625fe73a8d41cf41fb6ebba4bfe58f719405a46a` terminó correctamente el 2026-10-08: [Quality gate](https://github.com/andres-alvarez19/Property-based-testing/actions/runs/37819728353). Estos estados reflejan la entrega, no tareas por ejecutar.

## Backlog

| Task | Name | Depends on | Status |
|---|---|---|---|
| T01 | Bootstrap | contratos | DONE |
| T02 | Domain | T01 | DONE |
| T03 | Repository | T02 | DONE |
| T04 | Application Service | T03 | DONE |
| T05 | HTTP API | T04 | DONE |
| T06 | Property-Based Tests | T04 | DONE |
| T07 | Independent Verification | T05 + T06 | DONE |
| T08 | GitHub Actions CI | T07 | DONE |
| T09 | Delivery Hardening | T08 | DONE |

## Factory flow

```text
T01 -> T02 -> T03 -> T04
                     |
              +------+------+
              |             |
              v             v
             T05           T06
              |             |
              +------+------+
                     v
                    T07
                     |
                     v
                    T08
                     |
                     v
                    T09
```
