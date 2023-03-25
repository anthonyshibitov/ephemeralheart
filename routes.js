import token from "./token.js";
import db from "./db/db.js";

function getPost(req, res) {
    res.render("index");
}

async function getInterstitial(req, res) {
    try {
        const newToken = await token.generateToken(req.ip);
        const post = await db.getRandomPost();
        const id = post.post_id;
        //FUCK YOUUUUUU   vvvvv  TWO HOURS OF MY LIFE.. GONE!!!
        const postToken = await db.addPostToken(id, newToken);
        res.redirect(`/tribunal?token=${newToken}`);
    } catch (err) {
        console.error(err);
    }
}

async function getTribunal(req, res) {
    try {
        const auth = await token.authenticateToken(req.query.token);
        if (!auth) {
            res.redirect("postTokenDied");
        } else {
            const post_id = await db.getPostIDByToken(req.query.token);
            const post = await db.getPostByID(post_id);
            const dbResult = {
                postText: post.post_contents,
                passes: post.passes,
                token: req.query.token,
            };
            res.render("tribunal", dbResult);
        }
    } catch (err) {
        console.error(err);
    }
}

async function submitMessage(req, res) {
    try {
        const auth = await token.authenticateToken(req.body.token);
        if (!auth) {
            res.redirect("postTokenDied");
        } else {
            const post_id = await db.getPostIDByToken(req.body.token);
            const post = await db.getPostByID(post_id);
            res.render("submitMessage", {
                PB: req.body.PB,
                token: req.body.token,
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function submitMessagePost(req, res) {
    const post_id = await db.getPostIDByToken(req.body.token);
    console.log("[POST] TOKEN: ", req.body.token);
    console.log("[POST] POST: ", req.body.userMessage);
    console.log("[POST] P/B:", req.body.PB);
    console.log("[POST] ID:", post_id);
    const auth = await token.authenticateToken(req.body.token);
    if (!auth) {
        res.redirect(307, "/postTokenDied");
    } else {
        if (req.body.PB === "Pass") {
        }
        if (req.body.PB === "Burn") {
        }
        //ADD TO DB, DELETE/INC POST
        token.DestroyToken(req.body.token);
        res.redirect("/thanks");
    }
}

function postTokenDied(req, res) {
    res.render("postTokenDied", { userMessage: req.body.userMessage });
}

function getTokenDied(req, res) {
    res.render("postTokenDiedNOMSG");
}

function getThanks(req, res) {
    res.render("thanks.ejs");
}

// CLIENT END POINTS!! ~~

function stress(req, res) {
    console.log("[GET] getting STRESS TEST PATH :D");
    const newToken = token.generateToken();
    const result = token.authenticateToken(newToken);
    console.log("[TOKEN]", newToken, "is auth?", result);
    res.sendStatus(200);
}

export default {
    getPost,
    getTribunal,
    submitMessage,
    submitMessagePost,
    postTokenDied,
    getThanks,
    getTokenDied,
    getInterstitial,
    stress,
};
