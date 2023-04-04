import * as dotenv from "dotenv";
import jail from "../db/jail.js";
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

const args = process.argv;

if (args[2] == undefined) {
    console.log("Usage: banIP.js [ip-address]");
    process.exit(1);
} else {
    try {
        const result = await jail.banIP(args[2]);
        console.log("Banned", args[2]);
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
