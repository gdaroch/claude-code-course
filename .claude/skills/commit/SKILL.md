---
name: commit
description: Estandariza los mensajes de commit de este repositorio. Úsala siempre que el usuario pida hacer un commit ("commit", "haz commit de mis cambios", "hacer commit") o cuando le ofrezcas hacer un commit y acepte.
---

# Commit

Skill exclusiva de este proyecto. Estandariza los mensajes de commit.

## Cuándo usarla

- El usuario dice "commit", "haz commit de mis cambios", "hacer commit" o que debes hacer un commit.
- Le ofreciste hacer un commit y la respuesta fue positiva.

## Pasos

Sigue los pasos en orden. No avances si un paso indica detenerse.

### 1. Verificar la rama

Revisa la rama actual (`git branch --show-current`).

- **Es `main` o `master`:** pregunta al usuario si quiere hacer commit en la rama principal o cambiarse de rama primero. Si quiere cambiarse, propón un nombre de rama (basado en los cambios) y créala antes de continuar.
- **Otra rama:** continúa.

### 2. Verificar cambios fuera de staging

Revisa `git status`. Si hay cambios sin stagear (modificados no agregados, o archivos sin seguimiento):

- **Detente inmediatamente** y dile al usuario: "Tienes cambios que no se encuentran en staging".
- No agregues archivos a staging por tu cuenta.

### 3. Verificar cambios en staging

- **Hay cambios en staging:** continúa.
- **No hay:** dile al usuario que no se encuentran cambios disponibles para hacer commit y detente.

### 4. Crear el commit

Revisa lo staged con `git diff --staged` y arma el mensaje.

**Título:** `[Intención] Mensaje breve`

Intención (exactamente una):

- `Feat`
- `Bugfix`
- `Refactor`
- `Test`
- `Doc`
- `Design`

El mensaje breve describe muy brevemente qué se hizo.

**Descripción (cuerpo):** debe contener exclusivamente:

1. Listado de las cosas que cambiaron.
2. Razones por las que cambiaron.

No agregues nada más al cuerpo.

### Ejemplo

```
[Feat] Agrega filtro por estado en la lista de proyectos

Cambios:
- Nuevo componente StatusFilter en la lista de proyectos
- La consulta de proyectos acepta el parámetro status

Razones:
- Los usuarios necesitan encontrar rápidamente proyectos activos o archivados
```
