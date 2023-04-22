import db from "./db/db.js";
import jail from "./db/jail.js";
import chalk from "chalk";
import {time} from "./app.js";

async function pass(post_id, userMessage, ipAddress) {
    if (await jail.checkIPForBan(ipAddress)) {
        console.log(time(), chalk.redBright("[CANCEL POST]"), ipAddress, "is banned!");
    } else {
        try {
            await db.incrementPassByID(post_id);
            await db.createPost(userMessage, ipAddress);
        } catch (err) {
            console.error(err);
        }
    }
}

async function burn(post_id, userMessage, ipAddress) {
    if (await jail.checkIPForBan(ipAddress)) {
        console.log(time(), chalk.redBright("[CANCEL POST]"), ipAddress, "is banned!");
    } else {
        try {
            const result = await db.updatePostSameID(
                post_id,
                userMessage,
                ipAddress
            );
            return result;
        } catch (err) {
            console.error(err);
        }
    }
}

function screenPost(post) {
    const bad = process.env.BADS.split(",");
    for (let i = 0; i < bad.length; i++) {
        const reg = new RegExp(bad[i], "i");
        if (post.search(reg) != -1) {
            return false;
        }
    }
    return true;
}

export default { pass, burn, screenPost };
