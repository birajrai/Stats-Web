# Stats-Web

A simple Express.js API server for serving Minecraft player statistics from a MySQL database.

---

**This project is the web API companion for the [Stats-Plugin](https://github.com/birajrai/Stats-Plugin) Minecraft plugin.**

- **Stats-Plugin:** Minecraft server plugin that collects and stores player stats to a MySQL database. ([View Plugin Repo](https://github.com/birajrai/Stats-Plugin))
- **Stats-Web:** This web API (you are here) provides endpoints to access and display those stats (e.g., for web dashboards, leaderboards, etc). ([View Web Repo](https://github.com/birajrai/Stats-Web))

---

## How it works
1. **Stats-Plugin** runs on your Minecraft server and saves player stats to a MySQL database.
2. **Stats-Web** connects to the same database and exposes REST API endpoints for retrieving and displaying those stats (e.g., for web dashboards, leaderboards, etc).

## Features
- Retrieve player stats by UUID
- Get all player balances
- Leaderboards for top balances, most blocks broken, most playtime, most kills, and most deaths

## Requirements
- Node.js (v16+ recommended)
- MySQL database (populated by the Stats-Plugin)

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `example.env` to `.env` and fill in your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=stats
   DB_PORT=3306
   ```
4. Start the server:
   ```bash
   node index.js
   ```

## API Endpoints

- `GET /api/stats/:uuid` - Get stats for a player by UUID
- `GET /api/bank` - Get all player balances
- `GET /api/topbalance` - Get top 10 player balances
- `GET /api/mostblockbroken` - Get top 10 players by blocks broken
- `GET /api/mostplaytime` - Get top 10 players by playtime
- `GET /api/mostkills` - Get top 10 players by mob kills
- `GET /api/mostdeath` - Get top 10 players by deaths

All endpoints return JSON responses.

## Environment Variables
See `example.env` for required variables:
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL user
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `DB_PORT` - MySQL port (default: 3306)

## License
MIT
