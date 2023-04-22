import db from "./db/db.js";
import chalk from "chalk";
import restrict from "./db/restrict.js";
import {time} from "./app.js";

const tokens = [];

//in ms, token shelf life
const tokenTimeout = 200000;

async function generateToken(ipAddress) {
    let token = "";
    let characterSet = "abcdefghijklmnopqrstuvwxyz0123456789";

    token += "T";
    for (let i = 0; i < 10; i++) {
        token += characterSet.charAt(
            Math.floor(Math.random() * characterSet.length)
        );
    }

    console.log(time(), chalk.cyan("[TOKEN]"), token, "has been created :)");
    await db.addToken(token, ipAddress);
    //add IP to ipTokenCount table!
    await restrict.generateTokenCount(ipAddress);
    setTimeout(async () => {
        DestroyToken(token);
    }, tokenTimeout);
    return token;
}

async function DestroyToken(token) {
    const result = await db.removeTokenByString(token);
    if (result) {
        console.log(time(), chalk.cyan("[TOKEN]"), token, "has been destroyed");
    } else {
        console.log(time(), chalk.cyan("[TOKEN]"), token, "does not exist");
    }
}

async function authenticateToken(token, ip) {
    try {
        const canAuth = await restrict.isAllowedToAuth(ip);
        if (canAuth) {
            const result = await db.findTokenByString(token, ip);
            if (result != undefined) {
                return true;
            } else {
                //token isnt found
                //
                //DestroyToken(token);
                return false;
            }
        } else {
            //user has posted too much :(
            console.log(time(),
                chalk.redBright("[CANCEL POST]"),
                ip,
                "has exceeded daily token limit, or using foreign token"
            );

            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

export default { generateToken, authenticateToken, DestroyToken, tokenTimeout };
