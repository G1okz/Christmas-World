# Christmas World

Aplicación web con React, TypeScript y Vite. La interfaz actual muestra una pantalla inicial; las vistas de acceso y registro todavía no están implementadas.

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
  components/    Componentes de acceso y navegación, aún sin implementar
  contexts/      Contexto de autenticación, aún sin implementar
  pages/         Vistas de inicio, acceso y registro, aún sin implementar
  services/      Configuración de Firebase
  types/         Tipos de usuario, aún sin implementar
  App.tsx        Pantalla inicial
  main.tsx       Entrada de React
```
