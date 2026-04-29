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

- [ ] T045 Implement ServicesScreen.
- [ ] T046 Implement ServiceFormScreen.
- [ ] T047 Integrate services API.

## Phase 5 - Appointments and Scheduled Messages

### Backend

- [ ] T048 Create Appointment and ScheduledMessage entities.
- [ ] T049 Create MessageStatus enum.
- [ ] T050 Implement MessageTemplateRenderer.
- [ ] T051 Implement AppointmentService transaction.
- [ ] T052 Implement POST `/appointments`.
- [ ] T053 Implement GET `/appointments`.
- [ ] T054 Implement GET `/messages`.
- [ ] T055 Implement GET `/messages/{id}`.
- [ ] T056 Implement PUT `/messages/{id}`.
- [ ] T057 Implement PATCH `/messages/{id}/mark-as-sent`.
- [ ] T058 Implement PATCH `/messages/{id}/cancel`.
- [ ] T059 Implement GET `/messages/{id}/whatsapp-link`.

### Frontend

- [ ] T060 Implement AppointmentFormScreen.
- [ ] T061 Implement local return date preview.
- [ ] T062 Integrate POST `/appointments`.
- [ ] T063 Implement AppointmentsHistoryScreen.
- [ ] T064 Implement MessagesScreen.
- [ ] T065 Implement MessageDetailScreen.
- [ ] T066 Implement WhatsApp opening with Linking.
- [ ] T067 Integrate messages API.

## Phase 6 - Settings

### Backend

- [ ] T068 Create MessageTemplate entity.
- [ ] T069 Create NotificationSettings entity.
- [ ] T070 Implement GET/PUT `/settings/message-template`.
- [ ] T071 Implement GET/PUT `/settings/notifications`.
- [ ] T072 Implement GET/PUT `/salon/profile`.

### Frontend

- [ ] T073 Implement MoreScreen.
- [ ] T074 Implement MessageTemplateScreen.
- [ ] T075 Implement NotificationsScreen.
- [ ] T076 Implement SalonProfileScreen.
- [ ] T077 Integrate settings APIs.

## Phase 7 - Quality and Hardening

- [ ] T078 Add backend unit tests for date calculation and template rendering.
- [ ] T079 Add backend integration tests for auth.
- [ ] T080 Add backend integration tests for customer CRUD.
- [ ] T081 Add backend integration test for appointment generating message.
- [ ] T082 Add backend tests for SalonId isolation.
- [ ] T083 Add frontend tests for template replacement.
- [ ] T084 Add frontend tests for WhatsApp URL.
- [ ] T085 Add frontend tests for return date calculation.
- [ ] T086 Review all private endpoints for authorization.
- [ ] T087 Review upload security.
- [ ] T088 Remove mocks from integrated screens.
- [ ] T089 Run manual MVP validation script.
- [ ] T090 Update README with final local setup.
