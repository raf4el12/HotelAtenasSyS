# Architecture Audit Findings — 2026-03-06

## Module Dependency Graph

```
AppModule
  PrismaModule (global)
  RedisModule (global)
  AuthModule         -> UsersModule (forwardRef, bidirectional)
  UsersModule        -> AuthModule (forwardRef, bidirectional)
  FloorsModule       (no module deps)
  RoomsModule        -> FloorsModule (exports IFloorRepository)
  GuestsModule       (no module deps)
  RateRulesModule    (no module deps)
  ProductsModule     (no module deps)
  PackagesModule     (no module deps)
  StaysModule        -> RoomsModule, GuestsModule
  ReservationsModule -> RoomsModule, GuestsModule
```

## Controller Thinness Assessment

ALL controllers are thin by design — no business logic present. Every handler delegates
directly to a single use case with no pre/post processing except:

- AuthController: cookie management (set/clear) happens in the controller — this is
  correct, cookie transport is an HTTP concern that belongs in the interfaces layer.
  The `COOKIE_OPTIONS_BASE` constant defined at file scope is fine.

- ReservationsController: passes `ReservationStatus` enum values directly as arguments
  to `updateReservationStatusUseCase.execute(id, ReservationStatus.CONFIRMED)`.
  The enum import from `shared/domain/enums` is acceptable. However, using a single
  generic status-update use case called with different enum values from the controller
  is a subtle violation: the controller is deciding WHICH transition to attempt, which
  is a domain/application concern. See Issue #4 below.

- UsersController.delete: passes both `id` and `user.id` (the calling user's id) —
  correct pattern for soft-delete self-deletion guard.

## Findings by Severity

### CRITICAL

**C1 — Anemic Domain Entities** RESOLVED (Phase 1 refactor, 2026-03-06)
StayEntity now has `canCheckOut()`, `canCancel()`, `isOverdue()`.
ReservationEntity now has `VALID_TRANSITIONS` static map, `canTransitionTo()`, `overlaps()`.
RoomEntity now has `isAvailable()`.
All use cases updated to delegate to entity methods.
`guests/domain/entities/guest.entity.ts` — still anemic, not yet addressed.

**C2 — Status Transition Table in Application Layer** RESOLVED (Phase 1 refactor, 2026-03-06)
`validTransitions` map moved to `ReservationEntity.VALID_TRANSITIONS` static.
`UpdateReservationStatusUseCase` now calls `reservation.canTransitionTo(status)`.

**C3 — Hardcoded String Literals in Repository** RESOLVED (Phase 1 refactor, 2026-03-06)
`PrismaStayRepository` now uses `StayStatus.COMPLETED`, `StayStatus.CANCELLED`, `StayStatus.ACTIVE`
via value import (not type-only).

### HIGH

**H1 — Multi-Method Use Case Classes**
Files: `rate-rules/application/use-cases/manage-config.use-case.ts`
       `packages/application/use-cases/manage-package-items.use-case.ts`

`ManageConfigUseCase` has three methods: `findAll()`, `findByKey()`, `upsert()`.
`ManagePackageItemsUseCase` has two: `addItem()`, `removeItem()`.

The project convention is one class per use case with a single `execute()` method.
These god-classes violate that pattern and make the module's DI graph misleading
(one provider, three behaviors).

Additionally, `RateRulesController` calls `this.manageConfigUseCase.findAll()`,
`.findByKey()`, `.upsert()` — the controller is aware of internal method structure,
which means changing the use case method signatures requires updating the controller.

Fix: Split into `GetAllConfigUseCase`, `GetConfigByKeyUseCase`, `UpsertConfigUseCase`
and `AddPackageItemUseCase`, `RemovePackageItemUseCase`.

**H2 — No Check-In Workflow Connecting Reservations to Stays**
Files: `reservations/interfaces/controllers/reservations.controller.ts` line 68-74
       `stays/application/use-cases/create-stay.use-case.ts`

The `PATCH /reservations/:id/check-in` endpoint only transitions the reservation status
to `CHECKED_IN`. It does NOT create a Stay. The actual check-in (creating a Stay record
and occupying the room) must be done separately via `POST /stays`.

This creates a workflow gap: a reservation can be marked CHECKED_IN with no corresponding
Stay, and a Stay can be created with no linked reservation (reservationId is optional).
There is no enforcement that a check-in from a reservation goes through the stays module.

The `CreateStayDto.reservationId` is optional and unvalidated — the repository doesn't
verify the reservation exists or is in CONFIRMED status before linking.

Fix: Create a `CheckInFromReservationUseCase` that atomically transitions the reservation
to CHECKED_IN and creates the Stay in a single transaction. This use case would live in
StaysModule (since it orchestrates both) and would inject both IReservationRepository
and IStayRepository.

**H3 — No Price Calculation Domain Service**
File: `stays/application/dto/create-stay.dto.ts` — `stayPrice` is a client-supplied number

The client sends `stayPrice` and `estimatedPrice` raw. There is no server-side rate
calculation using the rate rules. This means pricing is entirely at the mercy of
whatever the client sends, with no validation against the configured rate rules.

Fix: Create a `RateCalculationDomainService` in a shared or rate-rules context that
computes prices from rate rule + stay mode + duration. Use it in CreateStayUseCase.

### MEDIUM

**M1 — Cross-Module Domain Interface Imports (Direct, Not Through DI)**
Files: `stays/application/use-cases/create-stay.use-case.ts` lines 3-4
       `stays/application/use-cases/check-out-stay.use-case.ts` line 3
       `stays/application/use-cases/cancel-stay.use-case.ts` line 3
       `reservations/application/use-cases/create-reservation.use-case.ts` lines 3-4

Use cases in `stays` and `reservations` import domain interfaces directly from sibling
module domain layers:
```ts
import type { IRoomRepository } from '../../../rooms/domain/repositories/room.repository.js';
import type { IGuestRepository } from '../../../guests/domain/repositories/guest.repository.js';
```

The actual implementations are provided at runtime through NestJS DI (via the module
`imports: [RoomsModule, GuestsModule]` which exports the tokens). The TypeScript imports
are type-only (`import type`) so there is no runtime coupling. This is acceptable but
creates a soft structural coupling at the type level.

The alternative — defining secondary port interfaces locally — is more DDD-pure but
adds boilerplate for minimal gain in this context. Current approach is acceptable, but
the team should be aware of this tradeoff.

**M2 — Auth Module Uses forwardRef (Circular Dependency)**
Files: `auth/application/auth.module.ts`, `users/application/users.module.ts`

`AuthModule` imports `UsersModule` (to inject `IUserRepository`) and `UsersModule`
imports `AuthModule` (to inject `IPasswordService`). This is resolved with `forwardRef()`
but circular module dependencies are a design smell.

Root cause: `UpdateProfileUseCase` and `GetProfileUseCase` live in `AuthModule` but
need the user repository. These profile use cases arguably belong in `UsersModule`,
which would eliminate the circular dependency.

**M3 — JwtStrategy Uses PrismaService Directly**
File: `auth/infrastructure/strategies/jwt.strategy.ts` lines 4, 21

JwtStrategy bypasses the repository abstraction and calls `prisma.user.findUnique()`
directly. This is a minor violation — it could and should use `IUserRepository.findById()`.

The practical impact is low (it's in the infrastructure layer) but it creates
inconsistency: the user lookup logic is duplicated between the strategy and
`FindUserByIdUseCase`.

Fix: Inject `IUserRepository` (available via the `forwardRef(UsersModule)` already in
AuthModule) and use `userRepository.findById(payload.id)`.

**M4 — Floors Module Not Exported from App Boundary Correctly**
`FloorsModule` exports `'IFloorRepository'`. `RoomsModule` imports `FloorsModule` to
consume that export. This is correct. However, `FloorsController` restricts all endpoints
to `UserRole.ADMIN` only, while `RoomsController` allows `RECEPTIONIST` to read rooms.
A receptionist can see rooms but cannot see floors — minor but a UX/access design question.

### LOW

**L1 — Inline Mapper Functions vs Separate Mapper Classes**
Repositories use inline private functions (`function mapToStayEntity(prismaStay: any)`)
with `any` typed parameters. The application layer uses separate helper modules
(`helpers/map-stay-response.ts`). The infrastructure mapper functions use `any` instead
of typed Prisma generated types, which loses compile-time safety.

Fix (low priority): Type the Prisma result objects using the generated Prisma types
within the infrastructure layer. Example:
```ts
import type { Stay, Guest, Room, User } from '../../../../generated/prisma/index.js';
type StayWithRelations = Stay & { guest: Guest | null; room: Room | null; ... };
function mapToStayEntity(prismaStay: StayWithRelations): StayEntity { ... }
```

**L2 — PaginationImproved in shared/ imports from domain/**
File: `shared/utils/value-objects/pagination-improved.value-object.ts` line 1

Imports `PaginatedResult` from `shared/domain/interfaces/`. This is acceptable since
it's within the same `shared/` package. The class name claims to be a "value object"
but it contains behavior (`getOffsetLimit`, `formatResponse`) making it more of a
utility/service. The naming is slightly misleading.

## What Is Working Well

- All PrismaService usage is correctly confined to `infrastructure/persistence/` files
- No use case directly uses PrismaService (JwtStrategy is the only exception, in infra layer)
- Controllers are genuinely thin — no business logic
- Module exports are clean — each module exports only its repository token
- The `shared/domain/enums/` pattern for cross-module enums avoids duplication
- `@Auth()` decorator correctly composes JWT guard + roles guard
- `PrismaModule` is global (not re-imported by each module) — correct
- `RedisModule` is global — correct
- Soft-delete pattern is used for users, rooms, floors
- Pagination is consistent across all list endpoints
