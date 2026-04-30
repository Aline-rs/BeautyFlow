# 18 - Professional-Centric Migration Strategy

## Objective

Document the migration sequence that moved BeautyFlow from a salon-centric schema to a professional-centric schema.

## Migration sequence

### 1. `20260429235830_ProfessionalCentricFoundation`

- introduces `user_salons`
- decouples professional identity from direct salon ownership
- moves auth/session semantics to `UserId`

### 2. `20260430005337_ProfessionalOwnedServicesAndSalonProfileContext`

- migrates services from salon-owned to professional-owned
- backfills `services.user_id` from `user_salons`
- fails if ownership cannot be derived safely

### 3. `20260430011514_CustomersWithoutRequiredSalon`

- keeps customer ownership on `UserId`
- makes `customers.salon_id` optional

### 4. `20260430012034_AppointmentsWithoutRequiredSalon`

- makes `appointments.salon_id` optional
- makes `scheduled_messages.salon_id` optional

## Data safety rules

- never rename `SalonId` to `UserId` blindly
- backfill ownership only from explicit relationship data
- fail the migration when there is no deterministic owner
- make salon context optional only after professional ownership is established

## Post-migration checks

1. `user_salons` contains expected links
2. all services have `user_id`
3. customers may exist with `salon_id = null`
4. appointments may exist with `salon_id = null`
5. scheduled messages may exist with `salon_id = null`
6. `/auth/me` still returns linked salons and current context
