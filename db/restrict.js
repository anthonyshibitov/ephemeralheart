import * as dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;

const MAX_DAILY_TOKENS = 4;

dotenv.config({ path: ".env" });

const pool = new Pool({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
    idleTimeoutMillis: 0,
});

async function generateTokenCount(ip) {
    try {
        const result = await pool.query(
            "SELECT * FROM ipTokenCount WHERE ipTokenCount_ip = $1",
            [ip]
        );
        //ip isnt on table. lets add it.
        if (result.rows[0] == undefined) {
            await pool.query(
                "INSERT INTO ipTokenCount (ipTokenCount_ip, ipTokenCount_count) VALUES ($1, $2)",
                [ip, 0]
            );
        }
    } catch (err) {
        console.error(err);
    }
}

async function incTokenCount(ip) {
    try {
        const result = await pool.query(
            "SELECT * FROM ipTokenCount WHERE ipTokenCount_ip = $1",
            [ip]
        );
        let tokenCount;
        //if it doesnt exist for some reason, lets make it.again lol
        if (result.rows[0] == undefined) {
            await pool.query(
                "INSERT INTO ipTokenCount (ipTokenCount_ip, ipTokenCount_count) VALUES ($1, $2)",
                [ip, 0]
            );
            tokenCount = 1;
        } else {
            //apparently it's case sensitive. lol
            tokenCount = result.rows[0].iptokencount_count + 1;
        }
        await pool.query(
            "UPDATE ipTokenCount SET ipTokenCount_count = $1 WHERE ipTokenCount_ip = $2",
            [tokenCount, ip]
        );
    } catch (err) {
        console.error(err);
    }
}

async function isAllowedToAuth(ip) {
    try {
        const result = await pool.query(
            "SELECT * FROM ipTokenCount WHERE ipTokenCount_ip = $1",
            [ip]
        );
        if (result.rows[0] == undefined) {
            return false;
        }
        if (result.rows[0].iptokencount_count >= MAX_DAILY_TOKENS) {
            return false;
        }
        return true;
    } catch (err) {
        console.error(err);
    }
}

export default { isAllowedToAuth, incTokenCount, generateTokenCount };
