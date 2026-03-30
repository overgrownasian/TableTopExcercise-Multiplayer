# Incident Response Tabletop

Multiplayer incident response tabletop game for classrooms, workshops, and team exercises.

This project started as a portable HTML tabletop exercise and has evolved into a Node.js + TypeScript multiplayer experience inspired by live classroom tools like Jackbox or Kahoot:

- a facilitator runs the room
- players join from their own devices
- each player builds a deck of security controls
- the facilitator draws inject cards across five rounds
- players can optionally submit a short incident report for bonus points
- an admin can manage the inject library through a protected builder interface

## What This Project Does

The game is designed to help teams talk through cyber incidents, operational disruption, reporting workflows, and recovery planning in a more engaging format.

### Core gameplay

1. The facilitator creates a room.
2. Players join on their own devices using the room code.
3. Each player builds a deck from control cards across four categories:
   - Identify
   - Protect
   - Detect
   - Respond
4. Once everyone locks in, the facilitator begins the incident phase.
5. The facilitator draws inject cards across five rounds.
6. Each player is scored based on which controls mitigate the inject impacts.
7. Players can optionally submit a simplified incident report for a `+5` bonus each round.
8. After round 5, the facilitator gets a final score modal for hotwash and discussion.

## Current Features

- Multiplayer facilitator / player room flow
- Room codes and reconnect support for refresh on the same browser
- Separate facilitator and player views
- Protected admin route for managing inject cards
- SQLite-backed inject library
- Legacy Game 1 injects imported into the current system
- Five-round gameplay flow
- Optional per-round player reporting with bonus scoring
- Docker build support

## Tech Stack

- Node.js
- TypeScript
- Express
- WebSockets (`ws`)
- SQLite (`node:sqlite`)
- esbuild
- dotenv

## Project Structure

```text
src/
  client/        Browser app for facilitator, player, and admin views
  shared/        Shared game data and TypeScript types
  server.ts      Express server, websocket room logic, admin auth, SQLite inject store
public/          Static frontend shell and built client bundle output
data/            SQLite database location (`injects.db`)
scripts/         Build and dev scripts
docker/          Container build files
dist/            Built server output
```

## Requirements

- Node.js 22+ recommended
- npm

If you plan to use Docker, install Docker Desktop or another Docker runtime.

## Local Development

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Build manually:

```bash
npm run build
```

Run the built server:

```bash
npm start
```

The app reads environment variables from `.env` automatically.

## Environment Variables

The server supports these environment variables:

```env
PORT=4310
JOIN_BASE_URL=https://your-domain.example.com
ADMIN_PASSWORD_HASH=scrypt$<saltBase64>$<hashBase64>
```

### `PORT`

Sets the web server port.

### `JOIN_BASE_URL`

Optional public base URL used for facilitator join links. This is especially useful in Docker or reverse-proxy deployments where the container only knows its internal IP address.

Example:

```env
JOIN_BASE_URL=https://tabletop.yourdomain.com
```

### `ADMIN_PASSWORD_HASH`

Required if you want to use the admin inject builder at `/admin/injects`.

There is no built-in default admin password.

If `ADMIN_PASSWORD_HASH` is missing:

- admin login is considered not configured
- the admin builder will not be usable
- gameplay routes still work

### Generate an admin password hash

Use this PowerShell command to generate a valid `scrypt` hash:

```powershell
node -e "const { randomBytes, scryptSync } = require('node:crypto'); const password = process.env.ADMIN_PASSWORD; if (!password) throw new Error('ADMIN_PASSWORD is required'); const salt = randomBytes(16); const hash = scryptSync(password, salt, 64); console.log(`scrypt$${salt.toString('base64')}$${hash.toString('base64')}`);"
```

Example:

```powershell
$env:ADMIN_PASSWORD="Choose-A-Strong-Password"
node -e "const { randomBytes, scryptSync } = require('node:crypto'); const password = process.env.ADMIN_PASSWORD; if (!password) throw new Error('ADMIN_PASSWORD is required'); const salt = randomBytes(16); const hash = scryptSync(password, salt, 64); console.log(`scrypt$${salt.toString('base64')}$${hash.toString('base64')}`);"
```

Then place the result in your `.env` file:

```env
ADMIN_PASSWORD_HASH=scrypt$...
PORT=4310
JOIN_BASE_URL=https://your-domain.example.com
```

## Running the App

Once the server is running, these routes are available:

- Facilitator: `/facilitator`
- Player: `/player`
- Admin inject builder: `/admin/injects`

Local example:

- [http://localhost:4310/facilitator](http://localhost:4310/facilitator)
- [http://localhost:4310/player](http://localhost:4310/player)
- [http://localhost:4310/admin/injects](http://localhost:4310/admin/injects)

## Classroom Usage

Recommended setup:

1. Project the facilitator screen to the class.
2. Have students join from their own devices on the player screen.
3. Let each player build their own control deck.
4. Lock decks.
5. Draw one inject at a time and discuss the outcome.
6. Use the final scoring modal and hotwash conversation as the debrief.

Rule of thumb:

- facilitator screen = projector / instructor view
- player screen = participant device view

## Admin Inject Builder

The inject builder is separated from gameplay and lives at:

```text
/admin/injects
```

This route uses:

- hashed password verification
- cookie-based admin session auth
- SQLite persistence

The builder can:

- list injects
- create injects
- edit injects
- delete injects

Inject data is stored in:

```text
data/injects.db
```

## Database Behavior

On startup, the app creates `data/injects.db` if it does not already exist.

Seed injects are inserted with `INSERT OR IGNORE`, which means:

- new installs get the bundled inject library
- existing installs pick up missing seed injects
- existing custom injects are not overwritten

## Docker

A Dockerfile is included at `docker/Dockerfile`.

Build the image:

```bash
docker build -f docker/Dockerfile -t incident-response-tabletop .
```

Run the container:

```bash
docker run --rm -p 4310:4310 \
  -e PORT=4310 \
  -e JOIN_BASE_URL="https://tabletop.yourdomain.com" \
  -e ADMIN_PASSWORD_HASH="scrypt$..." \
  -v "$(pwd)/data:/app/data" \
  incident-response-tabletop
```

Notes:

- mount `/app/data` so your inject library persists
- do not bake secrets into the image
- set `JOIN_BASE_URL` so facilitator join links point to your real public domain
- pass `ADMIN_PASSWORD_HASH` at runtime

## Deployment Notes

If you deploy this publicly:

- set a strong `ADMIN_PASSWORD_HASH`
- use HTTPS in front of the app
- keep the `data` directory persistent
- consider adding rate limiting and reverse-proxy protections

If the admin hash is missing in production, the admin builder will not be available.

## Legacy Content

This repo also contains the original standalone workshop files:

- `Game1 - IR  Tabletop v5.html`
- `GAME 2 - Emergency Response Focused v4.html`
- `Fillable Response Worksheet.html`

These are useful as historical reference and source material, but the active multiplayer experience is the TypeScript app served by `src/server.ts`.

## Known Gaps / Future Improvements

- add rate limiting for admin login
- add CSRF protection for admin write operations
- clean up some legacy inject wording and punctuation imported from the original Game 1 file
- add tagging, filtering, and difficulty levels for injects
- add facilitator-side export for reports and final scores

## License

No license file is currently included in this repository.

If you plan to publish publicly on GitHub, adding a license is recommended so others know how they can use the project.
