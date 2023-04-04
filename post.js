import db from "./db/db.js";
import jail from "./db/jail.js";
import chalk from "chalk";

async function pass(post_id, userMessage, ipAddress) {
    if (await jail.checkIPForBan(ipAddress)) {
        console.log(chalk.redBright("[CANCEL POST]"), ipAddress, "is banned!");
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
        console.log(chalk.redBright("[CANCEL POST]"), ipAddress, "is banned!");
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

export default { pass, burn };
