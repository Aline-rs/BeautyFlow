# Quality Checklist — BeautyFlow MVP

## Spec Quality

- [ ] Requirements are testable.
- [ ] Out-of-scope items are explicit.
- [ ] User scenarios cover full MVP flow.
- [ ] Acceptance criteria are clear.

## Frontend Quality

- [ ] Uses TypeScript.
- [ ] Uses design system colors.
- [ ] Uses reusable components.
- [ ] Forms validate required fields.
- [ ] API calls are not duplicated across screens.
- [ ] Upload photo has permission handling.
- [ ] WhatsApp URL uses encodeURIComponent.
- [ ] Empty states exist.

## Backend Quality

- [ ] Controllers do not contain complex business logic.
- [ ] DTOs are used for request/response.
- [ ] Password is hashed.
- [ ] JWT contains SalonId.
- [ ] Queries filter by SalonId.
- [ ] Appointment creation is transactional.
- [ ] Message status transitions are controlled.
- [ ] Upload validates file type and size.

## Security

- [ ] No secrets committed.
- [ ] No passwordHash returned.
- [ ] No stack trace exposed.
- [ ] CORS configured.
- [ ] Logs do not contain sensitive data.

## Manual Validation

- [ ] Create account.
- [ ] Login.
- [ ] Create customer with photo.
- [ ] Create service.
- [ ] Register appointment.
- [ ] Verify scheduled message.
- [ ] Open WhatsApp.
- [ ] Mark message as sent.
