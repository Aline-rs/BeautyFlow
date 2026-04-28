# BeautyFlow

BeautyFlow is a mobile-first MVP for beauty salons to manage customers, register services and appointments, and schedule WhatsApp follow-up messages.

## Repository Structure

- `beautyflow-api`: ASP.NET Core Web API
- `beautyflow-mobile`: Expo + React Native app
- `design-reference`: mandatory visual source of truth
- `docs`: project documentation
- `specs`: product and implementation specs

## Mobile Setup

```bash
cd beautyflow-mobile
npm install
npm run start
```

Validation:

```bash
npx tsc --noEmit
npx eslint App.tsx src --ext .ts,.tsx
```

## API Setup

```bash
cd beautyflow-api
dotnet restore
dotnet build
```
