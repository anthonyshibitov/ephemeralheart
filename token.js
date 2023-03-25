import db from "./db/db.js";

const tokens = [];

//in ms, token shelf life
const tokenTimeout = 20000;

async function generateToken(ipAddress) {
    let token = "";
    let characterSet = "abcdefghijklmnopqrstuvwxyz0123456789";

    token += "T";
    for (let i = 0; i < 10; i++) {
        token += characterSet.charAt(
            Math.floor(Math.random() * characterSet.length)
        );
    }

    console.log("[TOKEN]", token, "has been created :)");
    //tokens.push(token);
    await db.addToken(token, ipAddress);
    setTimeout(async () => {
        DestroyToken(token);
    }, tokenTimeout);
    return token;
}

async function DestroyToken(token) {
    // const index = tokens.indexOf(token);
    // if (index != -1) {
    //     tokens.splice(index, 1);
    //     console.log("[TOKEN]", token, "has been destroyed :(");
    // } else {
    //     console.log("[TOKEN]", token, "doesn't exist");
    // }
    const result = await db.removeTokenByString(token);
    if (result) {
        console.log("[TOKEN]", token, "has been destroyed");
    } else {
        console.log("[TOKEN]", token, "does not exist");
    }
}

async function authenticateToken(token) {
    // if (tokens.indexOf(token) != -1) {
    //     return true;
    // } else {
    //     return false;
    // }
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

export default { generateToken, authenticateToken, DestroyToken };
