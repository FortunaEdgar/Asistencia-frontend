# Asistencia Frontend

Interfaz web del sistema de asistencia de empleados. Permite registrarse, iniciar sesión y acceder a las vistas protegidas consumiendo la API de [Asistencia-backend](https://github.com/FortunaEdgar/Asistencia-backend).

## Funcionalidades

- Inicio de sesión y registro con validación de formularios
- Sesión basada en cookies, con cierre de sesión
- Guardias de ruta para páginas privadas y de invitados
- Errores de la API mostrados en cada campo del formulario

## Tecnologías

Vue 3, TypeScript, Vite, Pinia, Vue Router, VeeValidate y Zod.

## Requisitos

- Node.js `^22.18.0` o `>=24.12.0`
- pnpm
- El backend en ejecución

## Instalación

```sh
pnpm install
```

Define la URL del backend en el archivo `.env`:

```env
VITE_BACKEND_URL=<url-del-backend>/api
```

Inicia el servidor de desarrollo:

```sh
pnpm dev
```

## Scripts

| Comando        | Descripción                                 |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Servidor de desarrollo                      |
| `pnpm build`   | Comprobación de tipos y build de producción |
| `pnpm preview` | Vista previa del build                      |
| `pnpm lint`    | Análisis con Oxlint y ESLint                |
| `pnpm format`  | Formateo con Prettier                       |
