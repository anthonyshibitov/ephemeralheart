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

(async () => {
    try {
        const result = await pool.query("DELETE FROM iptokencount");
        console.log("IPTOKENCOUNT cleared!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
