# 17 - Professional-Centric Refactor Plan

## Objective

Evolve BeautyFlow from a salon-centric MVP into a professional-centric product where:

- the professional owns the customer portfolio
- the professional can work in multiple salons
- the salon becomes an operational context, not the owner of customers

## Product Truth After Refactor

- `User` represents the professional account.
- `Customer` belongs to the professional.
- `Salon` represents a workplace context.
- `UserSalon` defines which salons a professional can operate in.
- `Service` belongs to the salon.
- `Appointment` belongs to the professional and records the salon where it happened.
- `ScheduledMessage` derives from the appointment and preserves both professional ownership and salon context.

## Target Data Model

### Core entities

- `User`
  - `Id`
  - `Name`
  - `Email`
  - `PasswordHash`
  - `ProfilePhotoUrl`
  - timestamps

- `Salon`
  - `Id`
  - `Name`
  - `Phone`
  - `Email`
  - timestamps

- `UserSalon`
  - `Id`
  - `UserId`
  - `SalonId`
  - `Role`
  - `IsPrimary`
  - timestamps

- `Customer`
  - `Id`
  - `UserId`
  - `Name`
  - `Whatsapp`
  - `BirthDate`
  - `ContactPreference`
  - `PhotoUrl`
  - `Notes`
  - timestamps

- `Service`
  - `Id`
  - `SalonId`
  - `Name`
  - `SuggestedReturnDays`
  - `IsActive`
  - timestamps

- `Appointment`
  - `Id`
  - `UserId`
  - `SalonId`
  - `CustomerId`
  - `ServiceId`
  - `AppointmentDate`
  - `Notes`
  - timestamps

- `ScheduledMessage`
  - `Id`
  - `UserId`
  - `SalonId`
  - `AppointmentId`
  - `CustomerId`
  - `ServiceId`
  - `ScheduledForDate`
  - `MessageText`
  - `Status`
  - timestamps

### Settings ownership

Recommended MVP ownership:

- `NotificationSettings` belongs to `User`
- `MessageTemplate` belongs to `User`

Future option:

- salon-level overrides when a workplace has custom wording rules

## Authorization Model

### Identity

- JWT should use `UserId` as the primary identity claim.
- `SalonId` should no longer be the permanent tenant claim.

### Context rules

- Customer operations:
  - authorize by `UserId`
- Salon-context operations:
  - require selected `SalonId`
  - validate `UserSalon`
- Appointment creation:
  - customer must belong to current user
  - service must belong to selected salon
  - selected salon must be linked to current user

## API Refactor Plan

### Auth

Keep:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Refactor behavior:

- register creates only the professional account
- login returns user session plus linked salons
- `/auth/me` returns:
  - user profile
  - linked salons
  - optional preferred salon

### Professional profile

Add or repurpose:

- `GET /profile`
- `PUT /profile`
- `POST /profile/photo`

### Salons

Add:

- `GET /salons`
- `POST /salons`
- `POST /salons/{id}/link` only if linking existing salon is needed
- `GET /salon/profile`
- `PUT /salon/profile`

Context handling options:

1. Header-based:
   - `X-Salon-Id`
2. Query-based for selected endpoints
3. Request-body-based for commands such as appointment creation

Recommended approach:

- use `X-Salon-Id` for contextual reads
- use explicit `salonId` in command payloads when it is part of the business event

### Customers

Refactor:

- `GET /customers`
- `GET /customers/{id}`
- `POST /customers`
- `PUT /customers/{id}`
- `POST /customers/{id}/photo`

New rule:

- no customer endpoint should rely on salon ownership

### Services

Keep service ownership by salon.

Refactor:

- all service endpoints require salon context validation via `UserSalon`

### Appointments

Refactor create payload to include `salonId`.

Validation order:

1. validate user identity
2. validate `UserSalon`
3. validate customer ownership by user
4. validate service ownership by salon
5. create appointment and scheduled message

### Messages

Message queries can support:

- consolidated professional view
- optional salon filter

Recommended MVP:

- default to professional-wide list
- allow salon filter when useful

## Mobile Refactor Plan

### Session model

Auth session should store:

- token
- professional profile
- linked salons
- selected salon id

### UX changes

Add:

- salon linking flow
- salon selector
- professional profile separate from salon profile

Refactor:

- customer screens show full portfolio
- appointment form requires salon selection before service selection
- services screen depends on selected salon
- salon profile screen edits current salon context

### Navigation changes

Recommended additions:

- `SalonSelectorScreen` or salon switcher in top bar
- `ProfessionalProfileScreen`
- `LinkedSalonsScreen`

## Database Migration Strategy

### Phase A - additive migration

- create `user_salons`
- add `user_id` to `customers`
- add `user_id` to `appointments`
- add `user_id` to `scheduled_messages`
- add `profile_photo_url` to `users`

### Phase B - backfill

Using current schema:

- set `customers.user_id` from current owner user associated with `customers.salon_id`
- set `appointments.user_id` from current salon-linked user
- set `scheduled_messages.user_id` from appointment or salon-linked user
- create `user_salons` rows from current `users.salon_id`

### Phase C - behavioral cutover

- move reads from `SalonId` ownership to `UserId` ownership where applicable
- switch auth and current-user context

### Phase D - cleanup

- remove `users.salon_id`
- review obsolete indexes
- rename docs and tests to new ownership rules

## Testing Strategy

### Backend

- auth tests for multi-salon user session
- `UserSalon` validation tests
- customer ownership tests
- cross-user access denial tests
- service access limited to linked salons
- appointment creation validation matrix

### Frontend

- salon selection behavior
- customer portfolio rendering
- appointment flow with salon-dependent services
- persisted session hydration with linked salons

## Rollout Order

1. Update documentation and tasks
2. Introduce additive schema changes
3. Refactor auth/session contracts
4. Introduce `UserSalon` validation
5. Refactor customer ownership
6. Refactor appointment and message ownership
7. Update mobile session and salon selector UX
8. Remove legacy salon-centric assumptions

## Risks

- migration complexity for existing data
- temporary overlap between old and new ownership rules
- auth/session contract changes affecting mobile startup
- hidden assumptions in filters, tests and mocks

## Recommended Execution Slices

### Slice 1 - foundation

- `UserSalon`
- JWT/user context refactor
- docs and tests scaffolding

### Slice 2 - customer ownership

- move customers to `UserId`
- update customer API and mobile flows

### Slice 3 - salon-context operations

- salon list/select
- service access by selected salon
- appointment refactor

### Slice 4 - messages and settings

- professional-wide messages
- user-owned templates/settings
- final cleanup
