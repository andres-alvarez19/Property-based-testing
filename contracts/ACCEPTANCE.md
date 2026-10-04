# Acceptance Contract — Definition of Done

## 1. Global rules

Una tarea solo puede marcarse como completada cuando:

1. cumple sus criterios específicos en `tasks/`;
2. no contradice `DOMAIN.md`, `INVARIANTS.md`, `API.openapi.yaml` ni `TESTING.md`;
3. no modifica contratos salvo instrucción explícita;
4. no introduce funcionalidad fuera de alcance;
5. no deja fallos conocidos ocultos.

A partir de T01 deben ejecutar correctamente:

```bash
npm run typecheck
npm run lint
npm test
```

## 2. Code quality

- TypeScript strict.
- Sin `any` injustificado.
- Sin `@ts-ignore` para silenciar errores evitables.
- Sin tests `.skip` o `.only`.
- Sin TODO/FIXME en código final.
- Dependencias entre capas según `AGENTS.md`.
- Nombres orientados al dominio y responsabilidades pequeñas.

## 3. Final functional acceptance

Al finalizar T07/T09:

- Create persiste una cita válida.
- Read por ID existe.
- List existe.
- Update conserva el ID.
- Delete elimina físicamente.
- Input inválido se rechaza.
- Update/Delete inexistente producen Not Found.
- Slot ocupado produce Conflict.
- No hay cambios parciales tras fallos.
- API coincide con `API.openapi.yaml`.

## 4. Final Property-Based Testing acceptance

Debe existir evidencia automatizada de:

- propiedad Create;
- propiedad Read;
- propiedad Update;
- propiedad Delete;
- propiedad no double booking.

Además:

- cada propiedad obligatoria usa fast-check;
- cada una ejecuta al menos 100 casos;
- shrinking está habilitado;
- cada property parte con estado aislado;
- los datos no están hardcodeados como único mecanismo de cobertura.

## 5. CI acceptance

GitHub Actions debe ejecutar en cada Pull Request y push a `main`:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm test`
5. `npm run build`

La entrega no se considera lista con CI rojo.

## 6. Evidence

La entrega final debe incluir:

- `README.md` actualizado con instalación y ejecución;
- `docs/TRACEABILITY.md` completo;
- `VERIFICATION.md` generado/revisado en T07;
- código y pruebas versionados;
- workflow CI funcionando.
