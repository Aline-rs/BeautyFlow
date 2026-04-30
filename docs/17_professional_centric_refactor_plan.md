# 17 - Professional-Centric Refactor Plan

## Objective

Evolve BeautyFlow from a salon-centric MVP into a professional-centric product where:

- the professional owns the customer portfolio
- the professional can work in multiple salons
- the salon becomes operational context instead of data owner

## Product truth after refactor

- `User` is the professional account
- `Customer` belongs to the professional
- `Service` belongs to the professional
- `Salon` is an optional workplace context
- `UserSalon` validates where the professional can operate
- `Appointment` belongs to the professional and may store salon context
- `ScheduledMessage` derives from the appointment and may store salon context
- `MessageTemplate` and `NotificationSettings` belong to the professional

## Current target model

### Core entities

- `User`
- `Salon`
- `UserSalon`
- `Customer`
  - `UserId`
  - `SalonId?`
- `Service`
  - `UserId`
- `Appointment`
  - `UserId`
  - `SalonId?`
- `ScheduledMessage`
  - `UserId`
  - `SalonId?`

## Authorization rules

- identity is always `UserId`
- customer operations authorize by professional ownership
- service operations authorize by professional ownership
- salon context, when present, must be validated through `UserSalon`
- appointment and message flows may run without selected salon

## Mobile session model

Auth session stores:

- token
- professional profile
- linked salons
- selected salon id, which can also be `null`

## Implemented slices

### Slice 1 - foundation

- `UserSalon`
- auth and JWT centered on `UserId`
- register creates only the professional account
- professional profile separated from salon profile

### Slice 2 - portfolio ownership

- customer ownership by professional
- service ownership by professional
- professional-wide customer portfolio with optional salon context labels

### Slice 3 - contextual operations

- optional salon context for customers
- optional salon context for appointments
- optional salon context for scheduled messages
- mobile salon context selector with persisted choice

### Slice 4 - contextual UX

- messages show whether they came from `Conta profissional` or a selected salon
- appointments history shows the same context
- customers can be filtered by full portfolio or current salon context

## Remaining work

- automated regression tests for professional ownership and `UserSalon`
- cleanup of old mock fallback paths
- final spec/checklist sync across every closeout artifact

## Notes about services

The original plan assumed salon-owned services. The implemented product direction changed after product clarification:

- the professional is the protagonist
- services can exist without active salon context
- salon remains metadata for organization, not a hard dependency for service CRUD
