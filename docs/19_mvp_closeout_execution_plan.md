# MVP Closeout Execution Plan

## Purpose

This document translates the latest product and UX change requests into an execution-ready plan for the BeautyFlow MVP closeout.

It exists to help implementation happen in the right order, with clear scope, technical impact, and acceptance criteria.

## Product Decisions Confirmed

- The professional is the protagonist of the product.
- Salons are optional and exist only to classify where a customer is served.
- Customer, service, appointment, and message flows must remain centered on the professional.
- Salon context should appear only when it improves organization or filtering.
- UX must behave correctly on real devices, especially around safe areas, keyboard overlap, and bottom navigation clarity.

## Execution Strategy

The work should be delivered in this order:

1. Cross-app structural fixes
2. Home completion
3. Customer and appointment flow improvements
4. Message flow improvements
5. More/Profile/Salon organization updates
6. Service management improvements
7. Notification audit
8. Final regression and visual validation

This order reduces rework because:

- safe-area and keyboard fixes affect nearly every screen
- navigation/icon decisions should stabilize before polishing individual flows
- appointment and message changes are coupled and should be implemented together
- profile, salon, and service screens depend on the final product positioning already clarified above

## Cross-App Structural Work

### EP01 - Safe area and top spacing

Problem:
- On some devices, top titles and actions are being overlapped by the camera area or status bar.

Implementation:
- Review `Screen`, `TopBar`, and root navigator spacing.
- Ensure every main screen respects safe-area top insets.
- Remove any hardcoded top spacing that conflicts with device notches or dynamic status bar height.

Acceptance criteria:
- No title, back button, or top action is hidden behind notch, camera cutout, or status bar.
- Behavior is consistent on iPhone and Android devices with taller status areas.

### EP02 - Keyboard avoidance across forms

Problem:
- When the keyboard opens, the current screen does not always keep the focused field visible.

Implementation:
- Review `Screen` and all form screens for `KeyboardAvoidingView`, scroll handling, and content inset behavior.
- Ensure text inputs remain visible while the keyboard is open.
- Validate long forms with both top and bottom fields.

Affected screens:
- `Login`
- `Criar Conta`
- `Nova Cliente`
- `Registrar Atendimento`
- `Meu Perfil`
- `Novo Servico`
- `Mensagens Padrao`
- `Notificacoes`
- salon creation form inside `Saloes e clientes`

Acceptance criteria:
- Focused field is never hidden by the keyboard.
- Primary action button remains reachable or the user can scroll to it naturally.

### EP03 - Bottom tab icon redesign

Problem:
- Bottom tabs still use initials instead of meaningful icons.

Implementation:
- Replace text initials with icons for `Inicio`, `Clientes`, `Atend.`, `Mensagens`, and `Mais`.
- Keep labels visible below icons.
- Match icon size and visual weight to the current BeautyFlow UI style.

Acceptance criteria:
- Each tab uses a recognizable icon.
- Active and inactive states remain visually clear.

## Home

### EP04 - Replace placeholder with real dashboard

Implementation:
- Remove `HomePlaceholderScreen`.
- Build a production `HomeScreen` aligned to the current product scope.

Required content:
- greeting text: `Ola {primeiroNome}, seja bem vindo de volta!`
- card with number of salons, clickable to `Saloes e clientes`
- card with number of customers
- card with messages pending to send, clickable to `Mensagens`
- card with customers with upcoming follow-up, clickable to the corresponding list
- weekly activity summary

Remove:
- `Componentes base` card

Acceptance criteria:
- Home reflects real backend or integrated local state.
- Greeting uses only the professional's first name.
- Cards navigate correctly.

### EP05 - Weekly activity summary

Implementation:
- Define week-based summary metrics such as:
  - appointments registered this week
  - pending messages created this week
  - customers served this week
- Prefer metrics already derivable from appointments and messages before introducing new API complexity.

Acceptance criteria:
- Summary is easy to scan.
- Empty states are intentional and not broken-looking.

## Customers

### EP06 - Search suggestions

Implementation:
- Upgrade current search input to provide live customer suggestions while typing.
- Suggestions should prioritize name match, then phone match.
- Keep fast tap-to-open behavior.

Acceptance criteria:
- User sees matching suggestions before submitting full search intent.
- Suggestion list closes cleanly when the input is cleared or a customer is selected.

### EP07 - Filter and copy changes

Implementation:
- Rename `Portfolio profissional` to `Todas`.
- Replace summary copy:
  - default: `{n} clientes cadastradas`
  - salon filter active: `{n} clientes vinculadas ao salao`
- Remove top `+ Nova` button and keep only floating `+`.

Acceptance criteria:
- Customer list language matches the new product positioning.
- There is no duplicate create action at the top.

## New Customer

### EP08 - Form copy and field behavior

Implementation:
- Update salon helper text to:
  `Use esse campo apenas para indicar em qual salao essa cliente costuma ser atendida. Voce pode cadastrar um novo salao no menu Mais`
- Align date input behavior with `Registrar Atendimento`.
- Convert all selectable fields to explicit dropdown behavior.

Acceptance criteria:
- No selectable field relies on cycling values by repeated tap.
- Date selection is consistent with appointment flow.

## Appointments

### EP09 - History screen controls and filters

Implementation:
- Remove top `+ Novo` button.
- Add floating `+` button like `Clientes`.
- Move filter chips below the search bar.
- Remove `Com retorno`.
- Add `Mes passado`.
- Add salon filter chip so the professional can view appointments from a selected salon.
- Show customer photo on the left when available; otherwise show centered initials.

Acceptance criteria:
- Filtering is understandable and visually ordered.
- Card avatar behavior matches customer photo rules.

### EP10 - Register appointment flow

Implementation:
- Convert all selectable fields to dropdowns.
- Replace manual appointment date typing with calendar picker.
- Support selecting more than one service in the same appointment flow.
- Scheduled message date must use the service with the longest return interval.
- Remove message preview card from the screen.

Technical impact:
- API contract may need to evolve from single `ServiceId` to multiple services, unless the UI stores one primary service plus related services separately.
- Historical representation must define whether an appointment contains one displayed service or multiple displayed services.
- Scheduled message generation rules must be updated in both backend and mobile fallback paths.

Decision needed before implementation:
- Define whether multi-service appointments should persist:
  - one appointment with multiple services
  - one appointment plus a primary service and auxiliary labels
  - multiple appointment-service join rows

Recommended direction:
- introduce appointment-to-services support explicitly instead of faking multi-select in the UI

Acceptance criteria:
- User can register one appointment with multiple services.
- Follow-up date is based on the longest recurrence window.
- No manual message preview is required on the form.

## Messages

### EP11 - Messages list filters and card polish

Implementation:
- Remove `Erro` filter chip.
- Add `Canceladas` filter chip.
- Show customer photo on message card when available; otherwise show initials.

Acceptance criteria:
- Pending, sent, today, and canceled filters behave consistently.
- Avatar logic matches customer and appointment cards.

### EP12 - Message detail editing

Implementation:
- Show customer photo with the same avatar rules.
- Allow editing message text directly on the screen.
- Add explicit `Salvar texto` action.

Acceptance criteria:
- Edited text persists immediately after save.
- User can reopen the message and see the saved version.

## More

### EP13 - More screen identity cleanup

Implementation:
- Remove `Professional BeautyFlow`
- Show full user name in the main title area
- Remove `Conta Professional`
- Replace `P`, `S`, `C`, `M`, `N` with meaningful icons
- Remove `organizacao por salao`
- Remove the `saloes cadastrados` card

Acceptance criteria:
- Screen centers the professional identity.
- No leftover salon-centric copy remains in the hero area.

## My Profile

### EP14 - Profile UX stabilization

Implementation:
- Remove `Adicionar foto de perfil` card.
- Show pencil affordance over the profile photo.
- Fix form behavior so fields can be fully cleared and edited.
- Stop the save button from shifting while loading.
- Remove `carregando perfil` text.

Acceptance criteria:
- Text fields are editable without forced fallback text fighting the user.
- Save button stays visually stable during submit.
- Loading state is present but subtle.

## Salons and Customers

### EP15 - Salon classification screen refinement

Implementation:
- Remove `Sem salao informado` card.
- Rename hero title to `Classifique seu atendimento`.
- Update hero copy to:
  `Cadastre saloes para identificar onde cada cliente costuma ser atendida.`
- Show customer photo on salon cards when available; otherwise show initials.

Acceptance criteria:
- Screen reinforces the salon-as-classification model.
- Customer rows are visually richer and easier to scan.

## Services

### EP16 - Services list updates

Implementation:
- Remove top `+ Novo` button.
- Add floating `+` button like `Clientes`.
- Sort services alphabetically.

Acceptance criteria:
- List ordering is stable and predictable.
- There is only one clear create action.

### EP17 - Service form improvements

Implementation:
- Allow user to assign emoji or icon to the service.
- Display chosen emoji/icon on the service list left side.
- Remove `variaveis disponiveis` card.
- Convert `Status` field to dropdown.
- If editing an existing service, show `Excluir servico`.

Business rule:
- Deleting or disabling a service must not rewrite historical appointment records.

Decision needed before implementation:
- Define whether delete means hard delete or soft delete.

Recommended direction:
- use soft delete or inactive state for safety, while offering `Excluir servico` UI copy if desired

Acceptance criteria:
- Historical appointments remain readable even if the service no longer appears in active lists.

## Message Templates

### EP18 - Message template clarity

Implementation:
- Ensure salon placeholder resolves from the customer's linked salon when one exists.
- Give the message model field a visibly distinct background so it looks editable.

Acceptance criteria:
- User clearly understands the template field is interactive.
- Template variables produce salon-aware output when applicable.

## Notifications

### EP19 - Functional audit

Goal:
- Confirm whether notification settings are truly connected to device permission flow and any local or remote notification behavior.

Questions to answer during implementation:
- Does the app currently request OS notification permission?
- If yes, on which screen or event?
- Which notification is actually sent today?
- Is it a local notification, push notification, or only a saved setting with no runtime effect?
- Where is scheduling logic implemented?

Expected outputs:
- technical audit note
- decision whether to:
  - complete notification delivery
  - leave settings as future-facing
  - hide or simplify the feature for MVP honesty

Acceptance criteria:
- Team understands exactly what is real versus placeholder in notifications.

## Dependencies and Couplings

### High coupling items

- `Registrar Atendimento` multi-service support depends on a data model decision.
- Message scheduling visibility depends on appointment, customer, and messages flows staying synchronized.
- Search suggestions and dropdown consistency may benefit from shared reusable UI components.
- Safe area and keyboard avoidance should happen before deep screen polish.

### Likely reusable primitives to introduce

- `AppDropdown`
- `AppDatePickerField`
- `KeyboardAwareScreen`
- `SafeAreaTopBar` or safe-area-aware `TopBar`
- shared avatar row pattern for customer cards, appointment cards, salon cards, and message cards

## Proposed Delivery Slices

### Slice 1

- safe area
- keyboard avoidance
- bottom tab icons

### Slice 2

- Home rebuild
- customer list copy and controls
- appointment list controls

### Slice 3

- new customer dropdowns and date behavior
- salons and customers polish
- profile stabilization

### Slice 4

- messages list and detail improvements
- message template clarity
- service list/form polish

### Slice 5

- register appointment redesign with calendar
- multi-service implementation
- notification audit

### Slice 6

- full regression
- visual comparison against HTML prototype
- closeout checklist sync

## Validation Checklist

For each slice:

- run `expo lint`
- run `npx tsc --noEmit`
- run relevant backend build or tests when API behavior changes
- validate navigation manually on device
- verify safe-area behavior on a device with notch or camera cutout
- verify keyboard behavior in long forms
- compare against `design-reference/beautyflow_mvp_mobile_prototype.html`

## Recommended Next Step

Start with `Slice 1`, because it removes the most visible cross-app friction and creates a stable base for the remaining UI and flow refinements.
