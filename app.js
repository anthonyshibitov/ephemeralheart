import express from "express";
import routes from "./routes.js";
import db from "./db/db.js";

db.testConnection();
db.createPost(
    "IM GONNA KILLMYSELF AHHHHHHHHH HELPPPPPPP MEE SODKFASOKD",
    "192.168.1.81"
);

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("trust proxy", true);
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log("[SERVER] Boot");
    console.log(`[SERVER] Listening on port ${port}...`);
});

app.use("*", (req, res, next) => {
    console.log("[METHOD/PATH/IP]:", req.method, req.originalUrl, req.ip);
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

app.get("/stressTestPath", routes.stress);

// 404 route
app.use(function (req, res) {
    res.status(404).render("404");
});
