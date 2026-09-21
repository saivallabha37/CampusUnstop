# CampusUnstop Development Rules

## 1. Project Identity
CampusUnstop is a college event management platform.

Stack:
- Frontend: React 18
- Routing: React Router
- Styling: Tailwind CSS + existing project styling
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT
- Password hashing: bcryptjs

Never replace the existing stack unless explicitly instructed.

## 2. Existing Architecture
Respect the current architecture:

frontend/src/
- pages/
- components/
- contexts/
- services/

backend/
- models/
- controllers/
- routes/
- middleware/
- services/

Do not reorganize the entire project unnecessarily.

## 3. Database Is the Source of Truth
Never rely exclusively on frontend validation for security-sensitive rules.

Backend must enforce:
- authentication
- authorization
- event ownership
- eligibility
- registration deadlines
- event capacity
- duplicate registration prevention
- protected profile fields

Frontend validation should exist for UX, but backend validation is authoritative.

## 4. User Profile Rules

Normal students may edit:
- name
- phone
- college
- branch

Normal students must NOT be able to modify:
- email
- year
- role

These restrictions must exist on the backend, not only by disabling frontend inputs.

The user's academic year is authoritative for event eligibility.

## 5. Event Eligibility

Events may specify eligible academic years.

The system must:
- display all events
- clearly show eligibility information
- determine eligibility from the authenticated user's database year
- prevent ineligible users from registering
- enforce eligibility on the backend
- provide clear frontend feedback

Never bypass backend eligibility validation.

## 6. Registration

Registration must remain protected against:
- duplicate registrations
- full capacity
- expired registration deadlines
- nonexistent users/events
- ineligible users

Preserve the MongoDB unique constraint for userId + eventId.

Never introduce a frontend-only duplicate-registration solution.

## 7. Dialog System

Use the existing CampusDialog/DialogContext system.

Do NOT introduce:
- alert()
- confirm()
- prompt()

Do not revert existing custom dialog work.

Use appropriate dialog variants:
- success
- error
- warning
- information
- confirmation

## 8. UI/UX

Preserve the existing CampusUnstop visual identity unless a redesign is explicitly requested.

Existing direction:
- dark blue/purple theme
- modern college-event platform
- responsive UI
- reusable components
- clear event cards
- good empty/loading/error states

Do not introduce random colors, fonts, layouts, or component libraries without checking the existing design system first.

## 9. Code Quality

Before modifying code:
1. Understand the existing implementation.
2. Identify dependencies.
3. Identify possible regressions.
4. Make the smallest clean change necessary.

Prefer reusable components over duplicated UI logic.

Avoid unnecessary rewrites.

Do not create duplicate APIs, duplicate components, or duplicate state management.

## 10. Security

Never:
- expose secrets
- hardcode credentials
- commit .env files
- log passwords or tokens
- weaken authentication
- bypass authorization
- disable backend validation
- use unsafe database queries

Never modify authentication/security behavior without explicitly explaining the impact first.

## 11. Git Safety

Current development branch:
anti

For new feature work:
- create a dedicated branch from anti
- use names such as anti/calendar or anti/profile-fix

Never:
- force push
- reset --hard without explicit permission
- delete branches
- rewrite existing history
- modify main directly

Before committing:
- inspect git diff
- run appropriate tests/build
- report what changed

## 12. Development Workflow

For every feature:

PHASE 1 — Understand
Inspect the relevant existing implementation.

PHASE 2 — Plan
Explain:
- files that will change
- backend changes
- frontend changes
- database changes
- risks

PHASE 3 — Implement
Make the smallest maintainable implementation.

PHASE 4 — Verify
Run appropriate:
- frontend build
- backend checks/tests
- linting if available
- relevant API tests

PHASE 5 — Review
Check for:
- regressions
- security problems
- broken UI
- mobile responsiveness
- duplicated logic
- edge cases

PHASE 6 — Report
Give me:
- files changed
- what was implemented
- tests/checks performed
- remaining issues
- git status

## 13. User Instruction

I am the project owner.

Do not make major architectural decisions silently.

If a requested feature conflicts with existing architecture, explain the conflict and propose the safest implementation.

Do not start unrelated improvements just because you notice them.

Stay focused on the requested task.

## 14. Production Safety

Never deploy to production automatically.

Never modify production databases without explicit approval.

Never delete existing user/event/booking data unless explicitly instructed.

Always prefer reversible changes.

## 15. Existing Functionality

Treat currently working functionality as protected.

Before changing an existing feature:
- understand its current behavior
- preserve existing behavior unless the requested change intentionally modifies it
- verify related flows afterward.

