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

async function testConnection() {
    try {
        const output = await pool.query("SELECT NOW()");
        console.log("[DB] CONNECTION SUCCESS:", output.rows[0].now);
    } catch (err) {
        console.error(err);
    }
}

async function createPost(postContents, ipAddress) {
    try {
        const result = await pool.query(
            "INSERT INTO posts (post_contents, passes, post_ip, post_time) VALUES ($1, 0, $2, current_timestamp)",
            [postContents, ipAddress]
        );
        return result.rows[0];
    } catch (err) {
        console.error(err);
    }
}

// BURN
// Returns amount of passes
async function updatePostSameID(id, message, ipAddress) {
    try {
        const result0 = await pool.query(
            "SELECT passes FROM posts WHERE post_id = $1",
            [id]
        );
        const result1 = await pool.query(
            "UPDATE posts SET post_contents = $1 WHERE post_id = $2",
            [message, id]
        );
        const result2 = await pool.query(
            "UPDATE posts SET post_ip = $1 WHERE post_id = $2",
            [ipAddress, id]
        );
        const result3 = await pool.query(
            "UPDATE posts SET passes = 0 WHERE post_id = $1",
            [id]
        );
        return result0.rows[0].passes;
    } catch (err) {
        console.error(err);
    }
}

async function incrementPassByID(id) {
    try {
        const result = await pool.query(
            "SELECT * FROM posts WHERE post_id = $1",
            [id]
        );
        const passes = result.rows[0].passes + 1;
        await pool.query("UPDATE posts SET passes = $1 WHERE post_id = $2", [
            passes,
            id,
        ]);
    } catch (err) {
        console.error(err);
    }
}

async function getRandomPost() {
    try {
        const result = await pool.query(
            "SELECT * FROM posts ORDER BY random() LIMIT 1"
        );
        return result.rows[0];
    } catch (err) {
        console.error(err);
    }
}

// Returns undefined if does not exist
async function getPostByID(id) {
    try {
        const result = await pool.query(
            "SELECT *FROM posts WHERE post_id = $1",
            [id]
        );
        return result.rows[0];
    } catch (err) {
        console.error(err);
    }
}

async function addToken(tokenString, ipAddress) {
    try {
        const result = await pool.query(
            "INSERT INTO tokens (token_string, token_ip) VALUES ($1, $2)",
            [tokenString, ipAddress]
        );
        return result.rows[0];
    } catch (err) {
        console.error(err);
    }
}

async function removeTokenByString(tokenString) {
    try {
        const result = await pool.query(
            "DELETE FROM tokens WHERE token_string = $1 RETURNING *",
            [tokenString]
        );
        return result.rows[0];
    } catch (err) {
        console.error(err);
    }
}

async function findTokenByString(tokenString, ip) {
    try {
        const result = await pool.query(
            "SELECT * FROM tokens WHERE token_string = $1 AND token_ip = $2",
            [tokenString, ip]
        );
        return result.rows[0];
    } catch (err) {
        console.error(err);
    }
}

async function addPostToken(post_id, tokenString, ip) {
    try {
        const token = await findTokenByString(tokenString, ip);
        const token_id = token.token_id;
        try {
            const result = await pool.query(
                "INSERT INTO postTokens (fk_post_id, fk_token_id) VALUES ($1, $2)",
                [post_id, token_id]
            );
        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        console.error(err);
    }
}

async function getPostIDByToken(passToken, ip) {
    try {
        const token = await findTokenByString(passToken, ip);
        const token_id = token.token_id;
        const result = await pool.query(
            "SELECT * FROM postTokens WHERE fk_token_id = $1",
            [token_id]
        );
        return result.rows[0].fk_post_id;
    } catch (err) {
        console.error(err);
    }
}

export default {
    testConnection,
    createPost,
    updatePostSameID,
    incrementPassByID,
    getRandomPost,
    getPostByID,
    addToken,
    removeTokenByString,
    findTokenByString,
    addPostToken,
    getPostIDByToken,
};
