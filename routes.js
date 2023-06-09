import token from "./token.js";
import db from "./db/db.js";
import post from "./post.js";
import chalk from "chalk";
import restrict from "./db/restrict.js";
import jail from "./db/jail.js";
import {time} from "./app.js";

function getPost(req, res) {
    res.render("index");
}

async function getInterstitial(req, res) {
    try {
        const newToken = await token.generateToken(req.ip);
        const post = await db.getRandomPost();
        const id = post.post_id;
        //FUCK YOUUUUUU   vvvvv  TWO HOURS OF MY LIFE.. GONE!!!
        const postToken = await db.addPostToken(id, newToken, req.ip);
        res.redirect(`/tribunal?token=${newToken}`);
    } catch (err) {
        console.error(err);
    }
}

async function getTribunal(req, res) {
    try {
        const auth = await token.authenticateToken(req.query.token, req.ip);
        console.log(time(), "auth value:", auth);
        if (!auth) {
            res.redirect("postTokenDied");
        } else {
            const post_id = await db.getPostIDByToken(req.query.token, req.ip);
            const post = await db.getPostByID(post_id);
            const dbResult = {
                postText: post.post_contents,
                passes: post.passes,
                token: req.query.token,
                id: post_id,
            };
            res.render("tribunal", dbResult);
        }
    } catch (err) {
        console.error(err);
    }
}

async function submitMessage(req, res) {
    try {
        const auth = await token.authenticateToken(req.body.token, req.ip);
        if (!auth) {
            res.redirect("postTokenDied");
        } else {
            const post_id = await db.getPostIDByToken(req.body.token, req.ip);
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
    let messagePasses = undefined;
    const auth = await token.authenticateToken(req.body.token, req.ip);
    if (!auth) {
        res.redirect(307, "/postTokenDied");
    } else {
        //make sure theres no bad words :)
        if (post.screenPost(req.body.userMessage)) {
            if(req.body.userMessage.length <= 1000) {
                const post_id = await db.getPostIDByToken(req.body.token, req.ip);
                //Increment counter once token is authed
                restrict.incTokenCount(req.ip);
                console.log(time(),
                    chalk.inverse("[MSG RECVD SUCCESS]"),
                    "ID:",
                    post_id,
                    "P/B:",
                    req.body.PB,
                    "MSG:",
                    chalk.magenta(req.body.userMessage.slice(0, 20)),
                    "..."
                );
                if (req.body.PB === "Pass") {
                    const result = await post.pass(
                        post_id,
                        req.body.userMessage,
                        req.ip
                    );
                }
                if (req.body.PB === "Burn") {
                    messagePasses = await post.burn(
                        post_id,
                        req.body.userMessage,
                        req.ip
                    );
                }
            }
            token.DestroyToken(req.body.token);
            res.render("thanks.ejs");
        } else {
            console.log(time(),
                chalk.redBright("[CANCEL POST]"),
                "Post contained banned word. Banning",
                req.ip
            );
            //ban ip here lol
            jail.banIP(req.ip);
            token.DestroyToken(req.body.token);
            res.render("thanks.ejs");
        }
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

function getAbout(req, res) {
    res.render("about.ejs");
}

// CLIENT END POINTS!! ~~

async function stress(req, res) {
    console.log(time(), "[GET] getting STRESS TEST PATH :D");
    const newToken = await token.generateToken(req.ip);
    const result = await token.authenticateToken(newToken);
    console.log(time(), "[TOKEN]", newToken, "is auth?", result);
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
    getAbout,
};
