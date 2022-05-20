import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("port", 3000);

app.get("/", async(req, res) => {
    res.render("index");
});

app.post("/createPlayer", async (req, res) => {
    res.redirect("/");
});

app.get("/player/:id", async(req, res) => {
    res.render("player");
});

app.get("/player/:id/pokemon", async(req, res) => {
    res.render("pokemon");
});

app.post("/player/:id/save", async(req, res) => {
    res.redirect("/player/" + req.params.id);
});

app.post("/player/:id/pokemon/add/:pokeId", async(req, res) => {
    res.redirect("/player/" + req.params.id + "/pokemon");
});

app.post("/player/:id/pokemon/delete/:pokeId", async (req, res) => {
    res.redirect("/player/" + req.params.id + "/pokemon");

});


app.listen(app.get("port"), async () => {
    console.log(`Local url: http://localhost:${app.get("port")}`);
});
