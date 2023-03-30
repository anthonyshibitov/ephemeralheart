import db from "./db/db.js";
import chalk from "chalk";

const tokens = [];

//in ms, token shelf life
const tokenTimeout = 2000000;

async function generateToken(ipAddress) {
    let token = "";
    let characterSet = "abcdefghijklmnopqrstuvwxyz0123456789";

    token += "T";
    for (let i = 0; i < 10; i++) {
        token += characterSet.charAt(
            Math.floor(Math.random() * characterSet.length)
        );
    }

    console.log(chalk.cyan("[TOKEN]"), token, "has been created :)");
    await db.addToken(token, ipAddress);
    setTimeout(async () => {
        DestroyToken(token);
    }, tokenTimeout);
    return token;
}

async function DestroyToken(token) {
    const result = await db.removeTokenByString(token);
    if (result) {
        console.log(chalk.cyan("[TOKEN]"), token, "has been destroyed");
    } else {
        console.log(chalk.cyan("[TOKEN]"), token, "does not exist");
    }
}

async function authenticateToken(token) {
    try {
        const result = await db.findTokenByString(token);
        if (result != undefined) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

export default { generateToken, authenticateToken, DestroyToken, tokenTimeout };
