import express from "express";
import routes from "./routes.js";
import db from "./db/db.js";
import chalk from "chalk";
import md5 from "md5";
import token from "./token.js";

db.testConnection();
db.deleteTokens();
db.init();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("trust proxy", true);
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(time(), chalk.red("[SERVER]"), "Boot");
    console.log(time(), chalk.red("[SERVER]"), `Listening on port ${port}...`);
    console.log(time(),
        chalk.red("[SERVER]"),
        `Token shelf life (ms): ${token.tokenTimeout}`
    );
});

app.use("*", (req, res, next) => {
    console.log(time(),
        chalk.green("[METHOD/PATH/IP HASH]:"),
        req.method,
        req.originalUrl,
        req.ip
    );
    next();
});

app.get("/", routes.getPost);
app.get("/getInterstitial", routes.getInterstitial);
app.get("/tribunal", routes.getTribunal);
app.post("/submitMessage", routes.submitMessage);

app.post("/subRes", routes.submitMessagePost);
app.post("/postTokenDied", routes.postTokenDied);
app.get("/postTokenDied", routes.getTokenDied);

app.get("/thanks", routes.getThanks);
app.get("/about", routes.getAbout);

// app.get("/stressTestPath", routes.stress);

app.use("/favicon.ico", express.static("/favicon.ico"));

// 404 route
app.use(function (req, res) {
    res.status(404).render("404");
});

function time(){
    return (new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString());
}

export {time};