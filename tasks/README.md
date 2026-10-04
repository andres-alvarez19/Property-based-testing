# Factory Backlog

Cada archivo TXX constituye una orden de trabajo para Codex.

## Rules

- Ejecutar una tarea por vez, salvo T05 y T06, que pueden desarrollarse en paralelo después de T04.
- Cada agente debe leer `AGENTS.md` y los contratos indicados en su tarea.
- Los agentes no pueden modificar `contracts/`.
- Una tarea no se marca completa si fallan `typecheck`, `lint` o `test` una vez que dichos comandos existan.
- Preferir una rama/PR por tarea si se trabaja realmente con agentes en paralelo.

## Backlog

| Task | Name | Depends on | Status |
|---|---|---|---|
| T01 | Bootstrap | contratos | PENDING |
| T02 | Domain | T01 | PENDING |
| T03 | Repository | T02 | PENDING |
| T04 | Application Service | T03 | PENDING |
| T05 | HTTP API | T04 | PENDING |
| T06 | Property-Based Tests | T04 | PENDING |
| T07 | Independent Verification | T05 + T06 | PENDING |
| T08 | GitHub Actions CI | T07 | PENDING |
| T09 | Delivery Hardening | T08 | PENDING |

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
