# Christmas World

Aplicación web con React, TypeScript, Vite y Firebase. Incluye registro, inicio y cierre de sesión, recuperación de contraseña y protección de las rutas privadas.

## Requisitos

- Node.js 24.12 o posterior.
- npm.

## Configuración

Crea `.env.local` en la raíz del proyecto y añade la configuración de tu aplicación web de Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`.env.local` está excluido de Git. Las variables con prefijo `VITE_` se incluyen en el código que recibe el navegador; protege los datos de Firebase con reglas de Firestore y restricciones de API Key en Firebase Console.

En Firebase Console, activa el proveedor **Correo electrónico/contraseña**, la protección contra enumeración de correos y crea una base de datos de Cloud Firestore. Despliega las reglas del archivo `firestore.rules` antes de probar el registro; estas reglas permiten crear el perfil y el progreso inicial solo como parte de la reserva atómica del nickname. El email se normaliza a minúsculas y la contraseña debe tener al menos 8 caracteres.

Con Firebase CLI configurado para el proyecto correcto, despliega las reglas con:

```bash
firebase deploy --only firestore:rules
```

## Desarrollo

```bash
npm install
npm run dev
```

El servidor local muestra la dirección en la terminal. Después de cambiar `.env.local`, reinícialo para que Vite vuelva a cargar las variables.

## Compilación

```bash
npm run build
npm run preview
```

`npm run build` comprueba los tipos de TypeScript y genera los archivos de producción en `dist/`. `npm run preview` sirve esa compilación localmente.

## Estructura

```text
src/
  components/    Formularios de autenticación, rutas privadas y navegación
  contexts/      Estado de sesión y perfil
  pages/         Inicio, acceso, registro y recuperación de contraseña
  services/      Firebase y operaciones de autenticación
  types/         Tipos de perfil, progreso y autenticación
  App.tsx        Rutas públicas y privadas
  main.tsx       Entrada de React
firestore.rules  Reglas para perfiles, progreso y reservas de nickname
```
