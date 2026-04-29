# Implementation Plan — BeautyFlow MVP

**Branch**: `001-beautyflow-mvp`  
**Spec**: `spec.md`  
**Stack**: React Native Expo + ASP.NET Core + PostgreSQL

## Technical Context

### Frontend

- React Native with Expo.
- TypeScript.
- React Navigation.
- React Hook Form + Zod.
- Axios.
- Expo Image Picker.
- SecureStore for token.

### Backend

- ASP.NET Core Web API.
- .NET 8+.
- PostgreSQL.
- Entity Framework Core.
- JWT Bearer.
- Swagger.
- Serilog.

## Architecture

```text
Mobile App
  -> API REST
      -> Application Services
          -> Domain Entities
          -> Infrastructure EF Core
              -> PostgreSQL
```

## Frontend Architecture

Use feature-based organization:

```text
src/features/customers
src/features/services
src/features/appointments
src/features/messages
src/features/settings
src/features/auth
```

Shared components live in `src/components`.

## Backend Architecture

Use layered architecture:

```text
Api -> Application -> Domain
Api -> Infrastructure
Infrastructure -> Domain/Application
```

## Data Model

Use a professional-centric model:

- `User` is global.
- `UserSalon` links professionals to one or more salons.
- `Customer` belongs to the professional.
- `Service` belongs to the salon.
- `Appointment` references professional, salon, customer and service.
- `ScheduledMessage` derives from the appointment.

## Security Plan

- JWT authentication.
- Password hashing.
- User identity from token.
- Salon context validated against `UserSalon` when required.
- DTOs only.
- Upload validation.
- No secrets in repository.

## Quality Plan

- Unit tests for template rendering and date calculation.
- Backend integration tests for critical flows.
- Frontend utility tests for date/template/WhatsApp.
- Manual test of full MVP flow.

## Implementation Phases

### Phase 1 — Foundations

- Create mobile project.
- Create API solution.
- Configure theme, navigation, EF Core, JWT.

### Phase 2 — Auth and Professional Profile

- Register/login.
- Token persistence.
- Professional profile.
- Salon linking.

### Phase 3 — Customers and Services

- CRUD customers owned by the professional.
- Upload photo.
- CRUD services by salon.

### Phase 4 — Appointments and Messages

- Register appointment with selected salon.
- Generate scheduled message.
- List messages.
- Open WhatsApp.

### Phase 5 — Quality and Hardening

- Tests.
- Error handling.
- Security review.
- Remove mocks.

## Constraints

- Do not implement payments.
- Do not implement WhatsApp Cloud API.
- Do not introduce Redux unless justified.
- Do not skip backend validation.

## Manual Validation Script

1. Create account.
2. Create service Mechas with 15 days.
3. Create customer Gabriela with photo.
4. Register appointment on 2026-04-01.
5. Confirm message scheduled for 2026-04-16.
6. Open WhatsApp link.
7. Mark message as sent.
