const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = 10000;

// Helper: Standard error response
function sendError(res, status, message) {
    return res.status(status).json({ error: message });
}

// Helper: Safe JSON parse
function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// GET /api/stats/:uuid
app.get('/api/stats/:uuid', async (req, res) => {
    const { uuid } = req.params;
    if (!uuid || typeof uuid !== 'string' || uuid.length < 5) {
        return sendError(res, 400, 'Invalid UUID');
    }
    try {
        const [rows] = await pool.query(
            'SELECT stats FROM player_stats WHERE uuid = ?',
            [uuid]
        );
        if (rows.length === 0) {
            return sendError(res, 404, 'Player not found');
        }
        // stats is stored as JSON string in MySQL
        const rawStats = rows[0].stats;
        console.log('Raw stats from DB:', rawStats);
        if (rawStats === null || rawStats === undefined || rawStats === '') {
            return sendError(res, 500, 'Stats data is empty or null');
        }
        let statsJson = safeJsonParse(rawStats);
        // Try to parse again if first parse returns a string (double-encoded JSON)
        if (typeof statsJson === 'string') {
            statsJson = safeJsonParse(statsJson);
        }
        if (!statsJson) {
            return sendError(res, 500, 'Corrupted stats data: Invalid JSON');
        }
        res.json(statsJson);
    } catch (err) {
        console.error('Database error:', err);
        sendError(res, 500, 'Internal server error');
    }
});

// GET /api/bank
app.get('/api/bank', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT uuid, stats FROM player_stats');
        const balances = rows.map(row => {
            let balance = 0;
            const stats = safeJsonParse(row.stats);
            if (stats && typeof stats.balance === 'number') {
                balance = stats.balance;
            }
            return { uuid: row.uuid, balance };
        });
        balances.sort((a, b) => b.balance - a.balance);
        res.json(balances);
    } catch (err) {
        console.error('Database error:', err);
        sendError(res, 500, 'Internal server error');
    }
});

// GET /api/topbalance
app.get('/api/topbalance', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT uuid, stats FROM player_stats');
        const balances = rows.map(row => {
            let balance = 0;
            const stats = safeJsonParse(row.stats);
            if (stats && typeof stats.balance === 'number') {
                balance = stats.balance;
            }
            return { uuid: row.uuid, balance };
        });
        balances.sort((a, b) => b.balance - a.balance);
        const top10 = balances.slice(0, 10);
        res.json(top10);
    } catch (err) {
        console.error('Database error:', err);
        sendError(res, 500, 'Internal server error');
    }
});

// GET /api/mostblockbroken
app.get('/api/mostblockbroken', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT uuid, stats FROM player_stats');
        const blockbrokenArr = rows.map(row => {
            let blockbroken = 0;
            const stats = safeJsonParse(row.stats);
            if (stats && stats.stats && stats.stats["minecraft:mined"]) {
                blockbroken = Object.values(stats.stats["minecraft:mined"]).reduce((a, b) => a + b, 0);
            }
            return { uuid: row.uuid, blockbroken };
        });
        blockbrokenArr.sort((a, b) => b.blockbroken - a.blockbroken);
        const top10 = blockbrokenArr.slice(0, 10);
        res.json(top10);
    } catch (err) {
        console.error('Database error:', err);
        sendError(res, 500, 'Internal server error');
    }
});

// GET /api/mostplaytime
app.get('/api/mostplaytime', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT uuid, stats FROM player_stats');
        const playtimeArr = rows.map(row => {
            let playtime = 0;
            const stats = safeJsonParse(row.stats);
            if (stats && stats.stats && stats.stats["minecraft:custom"] && typeof stats.stats["minecraft:custom"]["minecraft:play_time"] === 'number') {
                playtime = stats.stats["minecraft:custom"]["minecraft:play_time"];
            }
            return { uuid: row.uuid, playtime };
        });
        playtimeArr.sort((a, b) => b.playtime - a.playtime);
        const top10 = playtimeArr.slice(0, 10);
        res.json(top10);
    } catch (err) {
        console.error('Database error:', err);
        sendError(res, 500, 'Internal server error');
    }
});

// GET /api/mostkills
app.get('/api/mostkills', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT uuid, stats FROM player_stats');
        const killsArr = rows.map(row => {
            let kills = 0;
            const stats = safeJsonParse(row.stats);
            if (stats && stats.stats && stats.stats["minecraft:custom"] && typeof stats.stats["minecraft:custom"]["minecraft:mob_kills"] === 'number') {
                kills = stats.stats["minecraft:custom"]["minecraft:mob_kills"];
            }
            return { uuid: row.uuid, kills };
        });
        killsArr.sort((a, b) => b.kills - a.kills);
        const top10 = killsArr.slice(0, 10);
        res.json(top10);
    } catch (err) {
        console.error('Database error:', err);
        sendError(res, 500, 'Internal server error');
    }
});

// GET /api/mostdeath
app.get('/api/mostdeath', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT uuid, stats FROM player_stats');
        const deathArr = rows.map(row => {
            let death = 0;
            const stats = safeJsonParse(row.stats);
            if (stats && stats.stats && stats.stats["minecraft:custom"] && typeof stats.stats["minecraft:custom"]["minecraft:deaths"] === 'number') {
                death = stats.stats["minecraft:custom"]["minecraft:deaths"];
            }
            return { uuid: row.uuid, death };
        });
        deathArr.sort((a, b) => b.death - a.death);
        const top10 = deathArr.slice(0, 10);
        res.json(top10);
    } catch (err) {
        console.error('Database error:', err);
        sendError(res, 500, 'Internal server error');
    }
});

// Catch-all for invalid /api/* routes except /api/invalid
app.all(/^\/api\/.+/, (req, res) => {
    res.status(404).json({ error: 'Invalid API endpoint.' });
});

app.listen(PORT, () => {
    console.log(`✅ API server running at http://localhost:${PORT}`);
});
