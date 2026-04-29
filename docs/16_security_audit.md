# 16 - Security Audit

## Date

- Audit date: 2026-04-29

## Scope

- `beautyflow-api`
- `beautyflow-mobile`

## Executive Summary

The project has a reasonable security foundation for a local MVP, but it is **not yet ready to be considered secure for production or for handling real customer data without additional hardening**.

The strongest areas today are:

- JWT-based authentication on private API controllers
- salon-level resource filtering in the main controllers reviewed
- password hashing with PBKDF2 and per-password salt
- token storage on mobile using `expo-secure-store`

The highest-risk gaps today are:

- development auth fallbacks in the mobile app
- trust in locally stored tokens without server revalidation
- internal exception details returned to clients
- public static serving of uploaded customer photos
- weak upload hardening
- versioned development secrets and passwords
- lack of brute-force protection on auth endpoints

## Risk Rating

- Overall rating: `Medium-High`
- Local development use: `Acceptable with caution`
- Shared beta with real user data: `Not recommended yet`
- Production use: `Not secure enough`

## Findings

### Critical

- None identified in the code reviewed.

### High

#### H1 - Mobile auth can fall back to mock sessions in development

- Severity: `High`
- Evidence:
  - [authService.ts](/C:/Workspace/BeautyFlow/beautyflow-mobile/src/features/auth/authService.ts:12)
  - [authService.ts](/C:/Workspace/BeautyFlow/beautyflow-mobile/src/features/auth/authService.ts:53)
- Details:
  - When login or registration fails with network error, `404`, or `5xx`, the mobile app can create a local mock session instead of failing auth.
  - This makes the mobile flow appear authenticated without proving the backend is actually available and enforcing real auth.
- Impact:
  - Masks backend auth failures.
  - Encourages testing and validation against an unreal state.
  - Can lead to incorrect assumptions about app security and readiness.
- Recommendation:
  - Remove auth mock fallback entirely from integrated builds.
  - If offline demo mode is needed, gate it behind an explicit developer-only flag that cannot be confused with real auth.

#### H2 - Stored tokens are trusted locally without server revalidation

- Severity: `High`
- Evidence:
  - [AuthContext.tsx](/C:/Workspace/BeautyFlow/beautyflow-mobile/src/features/auth/AuthContext.tsx:17)
  - [AuthContext.tsx](/C:/Workspace/BeautyFlow/beautyflow-mobile/src/features/auth/AuthContext.tsx:32)
- Details:
  - On app startup, any stored token is accepted and used to construct a session with synthetic user data.
  - There is no `/auth/me` verification call, no local token expiry check, and no refresh/invalid-session path during hydration.
- Impact:
  - The app UI can enter an authenticated state based only on local storage.
  - Expired, malformed, or stale tokens are not proactively rejected before protected flows are opened.
- Recommendation:
  - Hydrate with token storage only as a provisional state.
  - Immediately call `/auth/me` or equivalent to validate the session.
  - Clear invalid tokens automatically.

#### H3 - Development secrets and weak credentials are committed in config

- Severity: `High`
- Evidence:
  - [appsettings.json](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/appsettings.json:2)
  - [appsettings.Development.json](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/appsettings.Development.json:2)
- Details:
  - The repository contains plaintext development database credentials.
  - JWT key placeholders are versioned in appsettings files.
- Impact:
  - Shared environments tend to inherit insecure defaults.
  - Secrets handling culture stays weak and risky during transition to production.
- Recommendation:
  - Move secrets to environment variables or `dotnet user-secrets` for development.
  - Keep only safe placeholders in committed config.
  - Add a deployment guard that refuses startup with placeholder JWT keys outside local development.

### Medium

#### M1 - Global exception handler returns internal exception messages to the client

- Severity: `Medium`
- Evidence:
  - [GlobalExceptionMiddleware.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Middleware/GlobalExceptionMiddleware.cs:33)
- Details:
  - Unhandled exceptions are returned with `exception.Message` in the API response.
- Impact:
  - Can leak internal implementation details, query problems, invalid states, or infrastructure hints.
- Recommendation:
  - Return a generic client-safe message only.
  - Keep full exception details in logs.

#### M2 - Customer photo uploads are publicly accessible as static files

- Severity: `Medium`
- Evidence:
  - [Program.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Program.cs:18)
  - [CustomersController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/CustomersController.cs:214)
- Details:
  - Uploaded customer images are written under `wwwroot/uploads/customers`.
  - Static files are served before auth checks.
  - Resulting URLs are directly accessible if known.
- Impact:
  - Customer profile images are exposed outside protected API authorization flow.
  - This is a privacy risk, especially if real customer data is used.
- Recommendation:
  - Move uploads outside public static roots.
  - Serve them through authorized endpoints or signed URLs.

#### M3 - Upload validation is too light for user-provided files

- Severity: `Medium`
- Evidence:
  - [CustomersController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/CustomersController.cs:188)
  - [CustomersController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/CustomersController.cs:193)
  - [CustomersController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/CustomersController.cs:209)
- Details:
  - Validation checks only file presence, extension, and content type prefix.
  - No explicit size limit is enforced.
  - No binary signature validation or re-encoding step exists.
- Impact:
  - Increases risk of oversized uploads, malformed files, or disguised content.
- Recommendation:
  - Add max upload size limits.
  - Validate file signature.
  - Prefer reprocessing images before storage.

#### M4 - Auth endpoints have no visible brute-force or abuse protection

- Severity: `Medium`
- Evidence:
  - [AuthController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/AuthController.cs:34)
  - [AuthController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/AuthController.cs:79)
  - [Program.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Program.cs:15)
- Details:
  - Login and register endpoints are anonymous.
  - No rate limiting, IP throttling, or account lockout pattern is visible in the reviewed code.
- Impact:
  - Increases exposure to password guessing, enumeration attempts, and abusive traffic.
- Recommendation:
  - Add rate limiting for auth endpoints.
  - Consider temporary lockout or backoff strategy.
  - Normalize auth error responses to avoid user enumeration patterns.

#### M5 - Mobile API configuration is fixed to local HTTP

- Severity: `Medium`
- Evidence:
  - [client.ts](/C:/Workspace/BeautyFlow/beautyflow-mobile/src/lib/api/client.ts:3)
- Details:
  - The mobile app points to `http://localhost:5020`.
  - This is fine for a narrow local scenario but is not safe or portable.
- Impact:
  - Makes secure environment promotion harder.
  - Encourages non-TLS communication patterns.
- Recommendation:
  - Use environment-aware base URLs.
  - Require HTTPS outside explicit local development.

### Low

#### L1 - No explicit CORS policy is configured

- Severity: `Low`
- Evidence:
  - [Program.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Program.cs:5)
- Details:
  - No CORS setup is visible.
  - For native mobile this is not usually a primary issue, but it will matter if web builds or browser tooling are used.
- Recommendation:
  - Define explicit environment-based CORS policies if web clients are expected.

#### L2 - Input validation is mostly manual and uneven across controllers

- Severity: `Low`
- Evidence:
  - [AuthController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/AuthController.cs:42)
  - [ServicesController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/ServicesController.cs:125)
  - [CustomersController.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Controllers/CustomersController.cs:227)
- Details:
  - Validation rules are implemented ad hoc in controllers.
  - This is workable for MVP but tends to drift and miss edge cases.
- Recommendation:
  - Centralize validation using data annotations, FluentValidation, or consistent request validation patterns.

## Positive Controls Observed

### Authentication and authorization

- JWT validation checks issuer, audience, lifetime and signature:
  - [ServiceCollectionExtensions.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Extensions/ServiceCollectionExtensions.cs:22)
- Private controllers reviewed use `[Authorize]`:
  - customers, appointments, services, messages, settings, salon
- Current user identity exposes `UserId` and `SalonId` claims:
  - [CurrentUserService.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Api/Auth/CurrentUserService.cs:7)

### Tenant isolation

- Controllers reviewed consistently filter records by `SalonId`.
- This is one of the most important controls in the current backend design.

### Password storage

- Passwords are hashed with PBKDF2, random salt and fixed-time comparison:
  - [Pbkdf2PasswordHasher.cs](/C:/Workspace/BeautyFlow/beautyflow-api/src/BeautyFlow.Infrastructure/Auth/Pbkdf2PasswordHasher.cs:6)

### Mobile token storage

- Tokens are stored in SecureStore:
  - [tokenStorage.ts](/C:/Workspace/BeautyFlow/beautyflow-mobile/src/lib/storage/tokenStorage.ts:1)

## Recommended Remediation Order

### Immediate

- Remove mobile auth mock fallback.
- Validate stored tokens with the backend during app hydration.
- Stop returning raw exception messages to API clients.
- Move secrets out of committed appsettings files.

### Next

- Protect customer images behind authorized access.
- Add upload size limits and stronger file validation.
- Add auth endpoint rate limiting.
- Replace fixed HTTP mobile base URL with environment config.

### Before production

- Add security-focused automated tests for authorization and salon isolation.
- Add deployment checks for placeholder JWT keys and insecure configuration.
- Review logs for sensitive data exposure.
- Perform end-to-end testing with real auth and uploads only, no mock fallback paths.

## Suggested Follow-up Tasks

- Create `T091` Remove mobile auth mock fallback.
- Create `T092` Validate persisted mobile token with backend on startup.
- Create `T093` Replace client-visible internal exception details with generic error responses.
- Create `T094` Move development secrets to environment-based configuration.
- Create `T095` Protect customer photo access behind authorization.
- Create `T096` Add upload size and file signature validation.
- Create `T097` Add rate limiting for `/auth/login` and `/auth/register`.
- Create `T098` Add security regression tests for tenant isolation and unauthorized access.
