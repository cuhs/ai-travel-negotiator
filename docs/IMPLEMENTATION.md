# Implementation Notes

This document describes the current behavior of the AI Travel Negotiator prototype. It is meant to help contributors understand what exists before adding real integrations.

## Architecture

The app uses the Next.js App Router under `src/app`.

- UI pages live in `src/app/**/page.tsx`.
- API endpoints live in `src/app/api/**/route.ts`.
- Reusable client components live in `src/components`.
- Mock inventory and negotiation generation live in `src/lib/mock-data.ts`.
- Prisma setup lives in `src/lib/prisma.ts`.
- Database schema and migrations live in `prisma`.

The UI currently fetches API routes from client components. There are no server actions, authentication sessions, or external provider clients in the current implementation.

## Trip Lifecycle

1. `TripForm` loads supported cities from `GET /api/cities`.
2. The user completes the wizard and submits `POST /api/trips`.
3. The app redirects to `/trip/[id]`.
4. `HotelGrid` calls `POST /api/hotels` for that trip.
5. The hotel route deletes existing generated hotels for the trip, creates fresh mock hotels and offers, filters offers by budget, and marks the trip as `searching`.
6. The user selects hotels and calls `POST /api/negotiate`.
7. The negotiation route creates simulated `NegotiationCall` rows and returns the refreshed trip.
8. `ResultsTable` displays prices, savings, statuses, transcripts, CSV export, and approval controls.
9. Approval calls `POST /api/approve`, upserts the `TripDecision`, and marks the trip as `completed`.

## Status Values

Trip statuses:

- `draft` - trip was created.
- `searching` - mock hotel search has run.
- `negotiating` - negotiation endpoint has been called.
- `completed` - a hotel has been approved.

Negotiation statuses:

- `completed` - simulated call produced a discounted negotiated price.
- `failed` - simulated call reached the hotel but no discount was offered.
- `no_answer` - simulated call did not reach the hotel.
- `pending` and `calling` exist in shared types and UI badges but are not currently persisted by the mock negotiation route.

Decision statuses:

- `approved` is used by the current approval flow.
- `pending` and `rejected` exist in shared types but are not currently surfaced in the UI.

## Mock Data Behavior

`MOCK_CITIES` defines the supported destination list and city-level price ranges.

`HOTEL_TEMPLATES` defines city-specific hotel inventory. `getMockHotels` converts templates into trip-specific offers by applying:

- city price range,
- hotel price multiplier,
- room type multiplier,
- guest count factor,
- room count factor,
- number of nights.

`generateMockNegotiation` returns randomized outcomes:

- `rand < 0.1` creates a no-answer result.
- `rand < 0.25` creates a failed no-discount result.
- all other outcomes create a successful discount from 5% to 25%.

All transcripts are generated strings. They are not real call recordings or voice agent outputs.

## Database Assumptions

The app assumes there is a `User` row with id `user_1`. The `POST /api/seed` route creates it:

```bash
curl -X POST http://localhost:3000/api/seed
```

Trip creation uses the default `user_1` relation, so a fresh database should be seeded before creating trips through the UI.

The Prisma client is generated into `src/generated/prisma`, which is ignored by Git.

## Known Prototype Gaps

- No authentication or per-user authorization.
- No form schema validation on API request bodies.
- No real hotel search provider.
- No real voice calling provider.
- No real booking, payment, or cancellation workflow.
- No automated tests yet.
- Hotel search is regenerated from scratch when the trip detail page loads before negotiations exist.
- Results currently derive some display fields from available offer data and do not preserve every hotel display field in the table mapping.
