# Tasks - BeautyFlow MVP

## Format

- `[ ]` not started
- `[~]` in progress
- `[x]` done

## Phase 1 - Repository and Foundations

### Shared

- [x] T001 Create repository structure with `beautyflow-api`, `beautyflow-mobile`, `docs`, `specs`.
- [x] T002 Add root README with project overview and setup instructions.
- [x] T003 Add `.gitignore` for .NET, Node, Expo, env files and build outputs.

### Frontend foundation

- [x] T004 Create Expo TypeScript project in `beautyflow-mobile`.
- [x] T005 Install navigation, forms, validation, axios, image picker and secure storage dependencies.
- [x] T006 Create frontend folder structure.
- [x] T007 Implement theme files from design system.
- [x] T008 Implement base components: Screen, AppButton, AppInput, AppCard, AppChip, Avatar.
- [x] T009 Configure AuthNavigator, MainTabs and RootStack.

### Backend foundation

- [x] T010 Create .NET solution and projects.
- [x] T011 Configure project references.
- [x] T012 Configure appsettings and environment variables.
- [x] T013 Configure EF Core PostgreSQL.
- [x] T014 Configure Swagger with Bearer authentication.
- [x] T015 Configure global error middleware and response envelope.

## Phase 2 - Auth

### Backend

- [x] T016 Create User and Salon entities.
- [x] T017 Configure password hashing.
- [x] T018 Configure JWT service.
- [x] T019 Implement POST `/auth/register`.
- [x] T020 Implement POST `/auth/login`.
- [x] T021 Implement CurrentUser service with UserId and SalonId.

### Frontend

- [x] T022 Implement SplashScreen.
- [x] T023 Implement LoginScreen with validation.
- [x] T024 Implement SignUpScreen with validation.
- [x] T025 Implement AuthContext and token persistence.
- [x] T026 Integrate login/register with API.

## Phase 3 - Customers

### Backend

- [x] T027 Create Customer entity and mapping.
- [x] T028 Implement customer DTOs.
- [x] T029 Implement GET `/customers` with search and pagination.
- [x] T030 Implement GET `/customers/{id}` with history summary.
- [x] T031 Implement POST `/customers`.
- [x] T032 Implement PUT `/customers/{id}`.
- [x] T033 Implement POST `/customers/{id}/photo`.

### Frontend

- [x] T034 Implement CustomersScreen.
- [x] T035 Implement CustomerFormScreen.
- [x] T036 Implement PhotoPicker with preview.
- [x] T037 Implement CustomerDetailScreen.
- [x] T038 Integrate customers API.

## Phase 4 - Services

### Backend

- [x] T039 Create Service entity and mapping.
- [x] T040 Implement service DTOs.
- [x] T041 Implement GET `/services`.
- [x] T042 Implement POST `/services`.
- [x] T043 Implement PUT `/services/{id}`.
- [x] T044 Implement PATCH `/services/{id}/status`.

### Frontend

- [x] T045 Implement ServicesScreen.
- [x] T046 Implement ServiceFormScreen.
- [x] T047 Integrate services API.

## Phase 5 - Appointments and Scheduled Messages

### Backend

- [x] T048 Create Appointment and ScheduledMessage entities.
- [x] T049 Create MessageStatus enum.
- [x] T050 Implement MessageTemplateRenderer.
- [x] T051 Implement AppointmentService transaction.
- [x] T052 Implement POST `/appointments`.
- [x] T053 Implement GET `/appointments`.
- [x] T054 Implement GET `/messages`.
- [x] T055 Implement GET `/messages/{id}`.
- [x] T056 Implement PUT `/messages/{id}`.
- [x] T057 Implement PATCH `/messages/{id}/mark-as-sent`.
- [x] T058 Implement PATCH `/messages/{id}/cancel`.
- [x] T059 Implement GET `/messages/{id}/whatsapp-link`.

### Frontend

- [x] T060 Implement AppointmentFormScreen.
- [x] T061 Implement local return date preview.
- [x] T062 Integrate POST `/appointments`.
- [x] T063 Implement AppointmentsHistoryScreen.
- [x] T064 Implement MessagesScreen.
- [x] T065 Implement MessageDetailScreen.
- [x] T066 Implement WhatsApp opening with Linking.
- [x] T067 Integrate messages API.

## Phase 6 - Settings

### Backend

- [x] T068 Create MessageTemplate entity.
- [x] T069 Create NotificationSettings entity.
- [x] T070 Implement GET/PUT `/settings/message-template`.
- [x] T071 Implement GET/PUT `/settings/notifications`.
- [x] T072 Implement GET/PUT `/salon/profile`.

### Frontend

- [x] T073 Implement MoreScreen.
- [x] T074 Implement MessageTemplateScreen.
- [x] T075 Implement NotificationsScreen.
- [x] T076 Implement SalonProfileScreen.
- [x] T077 Integrate settings APIs.

## Phase 7 - Quality and Hardening

- [ ] T078 Add backend unit tests for date calculation and template rendering.
- [ ] T079 Add backend integration tests for auth.
- [ ] T080 Add backend integration tests for customer CRUD.
- [ ] T081 Add backend integration test for appointment generating message.
- [ ] T082 Add backend tests for professional ownership and salon-context isolation.
- [ ] T083 Add frontend tests for template replacement.
- [ ] T084 Add frontend tests for WhatsApp URL.
- [ ] T085 Add frontend tests for return date calculation.
- [ ] T086 Review all private endpoints for authorization.
- [ ] T087 Review upload security.
- [ ] T088 Remove mocks from integrated screens.
- [ ] T089 Run manual MVP validation script.
- [ ] T090 Update README with final local setup.

## Phase 8 - Security Hardening

- [ ] T091 Remove mobile auth mock fallback from integrated flows.
- [ ] T092 Validate persisted mobile token with backend during app startup.
- [ ] T093 Stop returning internal exception details in API error responses.
- [ ] T094 Move development secrets to environment-based configuration.
- [ ] T095 Protect customer photo access behind authorized delivery instead of public static exposure.
- [ ] T096 Add upload size limits and stronger file validation for customer photos.
- [ ] T097 Add rate limiting for `/auth/login` and `/auth/register`.
- [ ] T098 Add security regression tests for unauthorized access, professional ownership and salon-context isolation.

## Phase 9 - Professional-Centric Data Model

- [~] T099 Redefine the product scope from salon-owned customers to professional-owned customers in specs and docs.
- [~] T100 Refactor backend domain so `User` becomes a global professional entity instead of a `SalonOwnedEntity`.
- [~] T101 Create `UserSalon` entity and persistence mapping for professional-to-salon links.
- [~] T102 Refactor auth flow so register creates a professional account first and salon linking becomes a separate flow.
- [~] T103 Refactor JWT and current-user context to use `UserId` as the primary identity claim.
- [~] T104 Add backend support to create, list and select salons linked to the professional.
- [~] T105 Refactor `Customer` ownership from `SalonId` to `UserId`.
- [~] T106 Refactor customer queries and authorization to use professional ownership.
- [~] T107 Keep `Service` as a salon-owned entity and require salon context for service operations.
- [~] T108 Refactor `Appointment` to reference professional, salon, customer and service together.
- [~] T109 Refactor `ScheduledMessage` to derive from the appointment while preserving professional ownership and salon context.
- [~] T110 Update settings ownership rules so professional settings and salon settings are clearly separated.
- [~] T111 Update mobile auth/session flow to support multi-salon professionals.
- [ ] T112 Add mobile UX for linking, listing and selecting salons when a context is required.
- [ ] T113 Update customer screens and filters to present a professional-wide customer portfolio.
- [ ] T114 Add migration strategy from the current salon-centric schema to the professional-centric schema.
- [ ] T115 Add regression tests covering professional ownership, `UserSalon` validation and cross-salon access rules.

## MVP Closeout Priority List

### P1 - Complete the real Home flow

- [ ] P101 Replace `HomePlaceholderScreen` with a production `HomeScreen`.
- [ ] P102 Match the Home visual layout to `design-reference/beautyflow_mvp_mobile_prototype.html`.
- [ ] P103 Show real metrics for pending messages, upcoming follow-ups and appointments.
- [ ] P104 Add working navigation from Home to `AppointmentForm` and `Messages`.

### P2 - Remove mock fallbacks from integrated mobile flows

- [ ] P105 Remove mock auth fallback from `src/features/auth/authService.ts`.
- [ ] P106 Remove mock customer fallback from `src/features/customers/customersService.ts`.
- [ ] P107 Remove mock service fallback from `src/features/services/servicesService.ts`.
- [ ] P108 Remove mock appointment fallback from `src/features/appointments/appointmentsService.ts`.
- [ ] P109 Remove mock message fallback from `src/features/appointments/messagesService.ts`.
- [ ] P110 Remove mock settings fallback from `src/features/settings/settingsService.ts`.

### P3 - Close remaining visual and UX gaps

- [ ] P111 Review `CustomersScreen` against the HTML prototype and adjust spacing, hierarchy and states.
- [ ] P112 Review `CustomerFormScreen` and `CustomerDetailScreen` against the HTML prototype.
- [ ] P113 Review `ServicesScreen` and `ServiceFormScreen` against the HTML prototype.
- [ ] P114 Review `AppointmentFormScreen` and `AppointmentsHistoryScreen` against the HTML prototype.
- [ ] P115 Review `MessagesScreen` and `MessageDetailScreen` against the HTML prototype.
- [ ] P116 Review `MoreScreen`, `SalonProfileScreen`, `MessageTemplateScreen` and `NotificationsScreen` against the HTML prototype.
- [ ] P117 Add a visible loading/fallback experience while fonts load instead of returning `null` in `App.tsx`.

### P4 - Finish missing functional gaps in forms and flows

- [ ] P118 Confirm customer photo selection, preview and persistence work end-to-end.
- [ ] P119 Confirm appointment return-date calculation is correct and timezone-safe.
- [ ] P120 Confirm message text editing persists correctly.
- [ ] P121 Confirm WhatsApp link generation works correctly in list and detail flows.
- [ ] P122 Decide and implement whether service-level default message content is required in `ServiceFormScreen`.

### P5 - Fix environment and runtime readiness

- [ ] P123 Replace the fixed mobile API `baseURL` with environment-aware configuration.
- [ ] P124 Validate mobile-to-local API communication for emulator and physical device scenarios.
- [ ] P125 Validate uploaded customer photo URLs resolve correctly from the mobile app.

### P6 - Add automated test coverage

- [ ] P126 Create backend unit tests for date calculation and template rendering.
- [ ] P127 Create backend integration tests for auth flows.
- [ ] P128 Create backend integration tests for customer CRUD.
- [ ] P129 Create backend integration tests for appointment creation and scheduled message generation.
- [ ] P130 Create backend tests for professional ownership and salon-context isolation across protected resources.
- [ ] P131 Create frontend tests for template replacement.
- [ ] P132 Create frontend tests for WhatsApp URL generation.
- [ ] P133 Create frontend tests for return-date calculation.

### P7 - Security and hardening review

- [ ] P134 Review authorization on all private endpoints.
- [ ] P135 Review upload validation and file handling security.
- [ ] P136 Remove dead code and temporary compatibility paths no longer needed after integration cleanup.
- [ ] P137 Recheck shared components for regressions after closeout changes.

### P8 - Final validation and documentation

- [ ] P138 Run TypeScript check on the mobile app.
- [ ] P139 Run lint on the mobile app.
- [ ] P140 Run backend automated tests.
- [ ] P141 Execute full manual MVP navigation and regression validation.
- [ ] P142 Compare final mobile UI visually against the HTML prototype screen by screen.
- [ ] P143 Update `README.md` with final local setup and run instructions.
- [ ] P144 Sync `specs/001-beautyflow-mvp/checklists/tasks.md` with the real project status.
