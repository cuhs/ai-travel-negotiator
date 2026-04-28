# AI Travel Negotiator

AI Travel Negotiator is a local demo app for planning hotel trips, finding matching hotel offers, simulating phone-based price negotiations, and approving a final option. The current implementation is intentionally self-contained: hotel inventory, prices, phone calls, call transcripts, and negotiation outcomes are generated from mock data and stored in SQLite through Prisma.

## What Is Implemented

- Landing page with entry points to the trip wizard and dashboard.
- Multi-step trip creation flow for destination, dates, guests, rooms, budget, star rating, and notes.
- Dashboard for listing and deleting trips.
- Trip detail page that searches mock hotels, filters offers by trip budget and star rating, and lets the user select hotels for negotiation.
- Simulated negotiation workflow with randomized completed, failed, and no-answer outcomes.
- Results table with sorting, transcript expansion, CSV export, and approval of one hotel.
- Prisma data model for users, trips, hotels, offers, negotiation calls, and trip decisions.

## Tech Stack

- Next.js 16 App Router with React 19 and TypeScript.
- Tailwind CSS 4 via `@tailwindcss/postcss`.
- Prisma 7 with the `better-sqlite3` adapter.
- SQLite for local persistence.
- `date-fns` for date formatting and `lucide-react` for icons.

## Getting Started

Requires Node.js 20.9 or newer.

1. Install dependencies.

```bash
npm install
```

2. Create a local environment file.

```bash
cp .env.example .env
```

The default value is:

```bash
DATABASE_URL="file:./prisma/dev.db"
```

3. Generate the Prisma client and apply the database schema.

```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the development server.

```bash
npm run dev
```

5. Seed the demo user once the dev server is running.

```bash
curl -X POST http://localhost:3000/api/seed
```

6. Open the app.

```text
http://localhost:3000
```

## Main User Flow

1. Go to `/trip/new`.
2. Create a trip by selecting one of the supported cities: New York, Tokyo, Paris, London, Barcelona, or Sydney.
3. After creation, the trip detail page loads matching hotels from mock inventory through `POST /api/hotels`.
4. Select one or more hotels and start negotiation.
5. Review generated negotiation results, transcripts, and savings.
6. Approve a completed negotiation to save a `TripDecision` and mark the trip as completed.

## Available Routes

### Pages

- `/` - marketing-style home page.
- `/dashboard` - trip list and delete controls.
- `/trip/new` - multi-step trip form.
- `/trip/[id]` - hotel search, negotiation controls, and results.

### API Routes

- `GET /api/cities` - returns supported mock cities.
- `GET /api/trips` - returns trips with hotels, offers, negotiations, and decisions.
- `POST /api/trips` - creates a trip.
- `GET /api/trips/[id]` - returns one trip with related data.
- `PATCH /api/trips/[id]` - updates a trip with the provided body.
- `DELETE /api/trips/[id]` - deletes a trip.
- `POST /api/hotels` - regenerates mock hotels and offers for a trip.
- `POST /api/negotiate` - generates mock negotiation calls for selected hotels.
- `POST /api/approve` - stores or updates the approved hotel decision.
- `POST /api/seed` - creates the default demo user.

## Data Model

The Prisma schema lives in `prisma/schema.prisma`.

- `User` owns trips. The app currently assumes a single demo user with id `user_1`.
- `Trip` stores search criteria, status, related hotels, negotiation calls, and the final decision.
- `Hotel` stores generated hotel inventory for a trip.
- `HotelOffer` stores room and board options for a hotel.
- `NegotiationCall` stores simulated call results, transcript JSON, status, and pricing fields.
- `TripDecision` stores the approved hotel and final price.

## Local Data Notes

- Mock city and hotel data is defined in `src/lib/mock-data.ts`.
- `POST /api/hotels` deletes and recreates hotels for the given trip before returning matches.
- Negotiation outcomes are randomized. About 75% succeed, 15% fail with no discount, and 10% produce no answer.
- The app does not call real booking, voice, hotel, or payment APIs yet.
- `prisma/dev.db` and generated Prisma client files are ignored by Git. Recreate them locally with the Prisma commands above.

## Scripts

```bash
npm run dev      # start the Next.js dev server
npm run build    # create a production build
npm run start    # run the production build
npm run lint     # run ESLint
```

## Project Layout

```text
src/app/             Next.js App Router pages and route handlers
src/components/      Client UI components for the wizard, hotel list, and results
src/lib/             Prisma client setup and mock data generators
src/types/           Shared TypeScript types
prisma/              Prisma schema and migrations
docs/                Additional implementation documentation
```

## Development Notes

- This repository uses Next.js 16. Read the relevant files under `node_modules/next/dist/docs/` before changing App Router, route handler, or framework-specific code.
- Route handlers use the Web `Request` API and `NextResponse`.
- Dynamic route params are asynchronous in the current implementation and are awaited or unwrapped with React `use`.
- Keep generated Prisma output out of source control.
- Treat the current app as a prototype. Production work should add authentication, validation hardening, deterministic tests, real provider integrations, and a booking/payment handoff.
