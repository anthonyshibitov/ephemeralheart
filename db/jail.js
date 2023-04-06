import * as dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;

dotenv.config({ path: ".env" });

const pool = new Pool({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
    idleTimeoutMillis: 0,
});

// Returns TRUE if IP is banned
async function checkIPForBan(ip) {
    try {
        const result = await pool.query(
            "SELECT * FROM bannedIPs WHERE bannedIP_ip = $1",
            [ip]
        );

        //BANNED
        if (result.rows[0]) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

async function banIP(ip) {
    try {
        const result = await pool.query(
            "INSERT INTO bannedIPs (bannedIP_ip) VALUES ($1)",
            [ip]
        );
        return result.rows[0];
    } catch (err) {
        console.error(err);
    }
}

export default { checkIPForBan, banIP };
