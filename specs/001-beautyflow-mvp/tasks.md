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

- [x] T099 Redefine the product scope from salon-owned customers to professional-owned customers in specs and docs.
- [x] T100 Refactor backend domain so `User` becomes a global professional entity instead of a `SalonOwnedEntity`.
- [x] T101 Create `UserSalon` entity and persistence mapping for professional-to-salon links.
- [x] T102 Refactor auth flow so register creates a professional account first and salon linking becomes a separate flow.
- [x] T103 Refactor JWT and current-user context to use `UserId` as the primary identity claim.
- [x] T104 Add backend support to create, list and select salons linked to the professional.
- [x] T105 Refactor `Customer` ownership from `SalonId` to `UserId`.
- [x] T106 Refactor customer queries and authorization to use professional ownership.
- [x] T107 Refactor `Service` ownership to the professional and remove hard dependency on salon context for CRUD.
- [x] T108 Refactor `Appointment` to reference professional, salon, customer and service together.
- [x] T109 Refactor `ScheduledMessage` to derive from the appointment while preserving professional ownership and optional salon context.
- [x] T110 Update settings ownership rules so professional settings and salon settings are clearly separated.
- [x] T111 Update mobile auth/session flow to support multi-salon professionals.
- [x] T112 Add mobile UX for linking, listing and selecting salons when a context is required.
- [x] T113 Update customer screens and filters to present a professional-wide customer portfolio.
- [x] T114 Add migration strategy from the current salon-centric schema to the professional-centric schema.
- [ ] T115 Add regression tests covering professional ownership, `UserSalon` validation and cross-salon access rules.

## MVP Closeout Priority List

### P1 - Cross-app structural fixes

- [x] P101 Make `Screen`, `TopBar`, and root layout safe-area aware so top titles and actions are not covered by notch or camera cutout.
- [x] P102 Add consistent keyboard avoidance behavior for all long forms and text-input flows.
- [x] P103 Replace bottom-tab initials with meaningful icons for `Inicio`, `Clientes`, `Atendimentos`, `Mensagens`, and `Mais`.
- [x] P104 Recheck top spacing and keyboard behavior on real-device navigation flows after the shared layout changes.

### P2 - Build the real Home experience

- [x] P105 Replace `HomePlaceholderScreen` with a production `HomeScreen`.
- [x] P106 Match the Home visual layout to `design-reference/beautyflow_mvp_mobile_prototype.html`.
- [x] P107 Change the Home greeting copy to `Ola {primeiroNome}, seja bem vindo de volta!`.
- [x] P108 Add a clickable card with the quantity of salons and navigate it to `Saloes e clientes`.
- [x] P109 Add a card with the quantity of customers cadastradas.
- [x] P110 Make the `Mensagens para enviar` and `clientes com retorno proximo` cards clickable and route them to their corresponding screens.
- [x] P111 Remove the `Componentes base` card from Home.
- [x] P112 Add a weekly activity summary for the professional using real or integrated data.

### P3 - Improve customer discovery and customer form UX

- [ ] P113 Add live customer search suggestions to `CustomersScreen`.
- [ ] P114 Rename the `Portfolio profissional` filter chip to `Todas`.
- [ ] P115 Update the customer-count copy to `{} clientes cadastradas` and to `{} clientes vinculadas ao salao` when a salon filter is active.
- [ ] P116 Remove the top `+ Nova` button from `CustomersScreen` and keep only the floating create action.
- [ ] P117 Update the salon helper text in `CustomerFormScreen` to explain salon classification and mention the `Mais` menu.
- [ ] P118 Align the customer birth-date field behavior with the appointment date-selection pattern.
- [ ] P119 Convert all selectable customer-form fields to explicit dropdown interactions.
- [ ] P120 Review `CustomersScreen`, `CustomerFormScreen`, and `CustomerDetailScreen` against the HTML prototype and adjust spacing, hierarchy, and states.

### P4 - Refine appointments list and redesign register-appointment flow

- [ ] P121 Remove the top `+ Novo` button from `AppointmentsHistoryScreen` and add a floating `+` action like `Clientes`.
- [ ] P122 Move appointment filter chips below the search bar.
- [ ] P123 Remove the `Com retorno` appointment filter chip.
- [ ] P124 Add a `Mes passado` appointment filter chip.
- [ ] P125 Add a salon filter chip to appointments so the professional can view attendances by salon.
- [ ] P126 Show customer profile photo on appointment cards when available and fallback to centered initials otherwise.
- [ ] P127 Convert all selectable fields in `AppointmentFormScreen` to dropdown interactions.
- [ ] P128 Replace manual appointment-date typing with a calendar picker.
- [ ] P129 Remove the message-preview card from `AppointmentFormScreen`.
- [ ] P130 Decide the persistence model for multi-service appointments.
- [ ] P131 Implement multi-service selection in appointment registration.
- [ ] P132 Schedule the follow-up message date using the selected service with the longest recurrence window.
- [ ] P133 Review `AppointmentFormScreen` and `AppointmentsHistoryScreen` against the HTML prototype.

### P5 - Improve messages visibility, editing, and filtering

- [ ] P134 Remove the `Erro` filter chip from `MessagesScreen`.
- [ ] P135 Add a `Canceladas` filter chip to `MessagesScreen`.
- [ ] P136 Show customer profile photo on message cards and message detail when available, with initials fallback otherwise.
- [ ] P137 Allow editing message text directly in `MessageDetailScreen`.
- [ ] P138 Add a `Salvar texto` action in `MessageDetailScreen` and persist the edited text.
- [ ] P139 Review `MessagesScreen` and `MessageDetailScreen` against the HTML prototype.

### P6 - Align More, Profile, and Salons and Customers with the professional-first product scope

- [ ] P140 Remove `Professional BeautyFlow` from `MoreScreen`.
- [ ] P141 Show the professional's full name in the hero area instead of the generic product name.
- [ ] P142 Remove `Conta Professional` copy from `MoreScreen`.
- [ ] P143 Replace `P`, `S`, `C`, `M`, and `N` menu initials with meaningful icons.
- [ ] P144 Remove the salon-organization copy and salon-summary card from `MoreScreen`.
- [ ] P145 Remove the `Adicionar foto de perfil` card from `ProfessionalProfileScreen`.
- [ ] P146 Add a pencil affordance over the profile photo in `ProfessionalProfileScreen`.
- [ ] P147 Fix profile-form editing behavior so fields can be cleared and edited normally.
- [ ] P148 Stabilize the `Salvar alteracoes` button in `ProfessionalProfileScreen` and remove the `carregando perfil` text.
- [ ] P149 Remove the `Sem salao informado` card from `SalonsScreen`.
- [ ] P150 Rename the salons hero title to `Classifique seu atendimento`.
- [ ] P151 Update the salons hero copy to `Cadastre saloes para identificar onde cada cliente costuma ser atendida.`
- [ ] P152 Show customer profile photo in salon customer rows when available, with initials fallback otherwise.

### P7 - Polish service management

- [ ] P153 Remove the top `+ Novo` button from `ServicesScreen` and keep only the floating create action.
- [ ] P154 Sort the services list alphabetically.
- [ ] P155 Allow assigning an emoji or icon to a service in `ServiceFormScreen`.
- [ ] P156 Display the chosen emoji or icon on the left side of the service card in `ServicesScreen`.
- [ ] P157 Remove the `variaveis disponiveis` card from `ServiceFormScreen`.
- [ ] P158 Convert the `Status` field in `ServiceFormScreen` to a dropdown.
- [ ] P159 Add an `Excluir servico` action when editing an existing service.
- [ ] P160 Preserve historical appointment records when a service is deleted or deactivated.
- [ ] P161 Review `ServicesScreen` and `ServiceFormScreen` against the HTML prototype.

### P8 - Clarify message templates and audit notifications

- [ ] P162 Resolve the salon placeholder in message templates using the salon linked to the customer whenever one exists.
- [ ] P163 Give the message-template text field a distinct editable background.
- [ ] P164 Audit whether the notifications screen triggers OS permission requests on the device.
- [ ] P165 Document which notification is actually sent today, how it is configured, and whether it is local, push, or placeholder-only.
- [ ] P166 Decide whether notifications should be completed, simplified, or hidden for MVP honesty.

### P9 - Remove temporary mobile fallbacks and close remaining runtime gaps

- [ ] P167 Remove mock auth fallback from `src/features/auth/authService.ts`.
- [ ] P168 Remove mock customer fallback from `src/features/customers/customersService.ts`.
- [ ] P169 Remove mock service fallback from `src/features/services/servicesService.ts`.
- [ ] P170 Remove mock appointment fallback from `src/features/appointments/appointmentsService.ts`.
- [ ] P171 Remove mock message fallback from `src/features/appointments/messagesService.ts`.
- [ ] P172 Remove mock settings fallback from `src/features/settings/settingsService.ts`.
- [ ] P173 Replace the fixed mobile API `baseURL` with environment-aware configuration.
- [ ] P174 Validate mobile-to-local API communication for emulator and physical-device scenarios.
- [ ] P175 Validate uploaded customer photo URLs resolve correctly from the mobile app.

### P10 - Functional checks and automated coverage

- [ ] P176 Confirm customer photo selection, preview, and persistence work end-to-end.
- [ ] P177 Confirm appointment return-date calculation is correct and timezone-safe.
- [ ] P178 Confirm message text editing persists correctly.
- [ ] P179 Confirm WhatsApp link generation works correctly in list and detail flows.
- [ ] P180 Decide whether service-level default message content is required in `ServiceFormScreen` and implement it if approved.
- [ ] P181 Create backend unit tests for date calculation and template rendering.
- [ ] P182 Create backend integration tests for auth flows.
- [ ] P183 Create backend integration tests for customer CRUD.
- [ ] P184 Create backend integration tests for appointment creation and scheduled message generation.
- [ ] P185 Create backend tests for professional ownership and salon-context isolation across protected resources.
- [ ] P186 Create frontend tests for template replacement.
- [ ] P187 Create frontend tests for WhatsApp URL generation.
- [ ] P188 Create frontend tests for return-date calculation.

### P11 - Security, hardening, and cleanup

- [ ] P189 Review authorization on all private endpoints.
- [ ] P190 Review upload validation and file-handling security.
- [ ] P191 Remove dead code and temporary compatibility paths no longer needed after the integration cleanup.
- [ ] P192 Recheck shared components for regressions after the closeout changes.

### P12 - Final validation and closeout documentation

- [ ] P193 Run TypeScript check on the mobile app.
- [ ] P194 Run lint on the mobile app.
- [ ] P195 Run backend automated tests.
- [ ] P196 Execute full manual MVP navigation and regression validation on device.
- [ ] P197 Compare the final mobile UI visually against the HTML prototype screen by screen.
- [ ] P198 Update `README.md` with final local setup and run instructions.
- [ ] P199 Sync `specs/001-beautyflow-mvp/checklists/tasks.md` with the real project status.
