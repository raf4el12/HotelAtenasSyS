# Staff Architect Memory — Hotel Atenas PMS

See topic files for details. Links below.

## Module Inventory (as of 2026-03-06)
Implemented: auth, users, floors, rooms, guests, rate-rules, products, packages, stays, reservations
All registered in AppModule. See `architecture.md` for dependency graph.

## Key Patterns Confirmed
- DI tokens: string literals e.g. `'IUserRepository'`, `'IRoomRepository'`
- Repositories injected with `@Inject('TOKEN')` in use cases
- PrismaService ONLY used in `infrastructure/persistence/` repos (correct)
- JwtStrategy is the one exception: uses PrismaService directly (known/acceptable)
- Enums live in `shared/domain/enums/` and are used across module boundaries (correct)
- Pagination: `PaginationImproved` value object in `shared/utils/value-objects/`
- Mappers: inline functions inside repo files (`mapToXEntity`) AND separate helper files in use-cases (`helpers/map-x-response.ts`) — two-mapper pattern

## Critical Issues Found (see `audit-findings.md`)
1. ~~Anemic domain entities~~ RESOLVED (Phase 1) — StayEntity/ReservationEntity/RoomEntity enriched with business methods
2. ~~Status transition logic in use case~~ RESOLVED (Phase 1) — moved to ReservationEntity.VALID_TRANSITIONS + canTransitionTo()
3. ~~Hardcoded string literals in PrismaStayRepository~~ RESOLVED (Phase 1) — uses StayStatus enum values
4. ReservationsController directly passes ReservationStatus enum values to use case from controller layer
5. Cross-module domain interface imports (type-only, acceptable tradeoff)
6. ManageConfigUseCase and ManagePackageItemsUseCase are multi-method use case classes (violates SRP)
7. No CheckIn use case for stays — reservation CHECKED_IN has no Stay creation wiring
8. No rate/price calculation — stayPrice passed raw from client
9. GuestEntity still anemic — no business methods

## Bounded Contexts
- Rooms (Floor -> Room): property management
- Guests: CRM
- Stays: operations (check-in/check-out) — depends on Rooms + Guests
- Reservations: future bookings — depends on Rooms + Guests
- RateRules + HotelConfig: pricing configuration
- Products + Packages: POS/inventory
- Auth + Users: identity
