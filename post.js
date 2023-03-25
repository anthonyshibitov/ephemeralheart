import db from "./db/db.js";

async function pass(post_id, userMessage, ipAddress) {
    try {
        await db.incrementPassByID(post_id);
        await db.createPost(userMessage, ipAddress);
    } catch (err) {
        console.error(err);
    }
}

async function burn(post_id, userMessage, ipAddress) {
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

export default { pass, burn };
