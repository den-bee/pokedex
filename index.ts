import { create } from "domain";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://michielbaert:EMnd4mQCAA6qy8dy@mijncluster.ppxqq.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("port", 3000);

interface Player {
    _id?: ObjectId;
    name: string;
}

let players: Player[] = [];

const getPlayerById = (id: string) => {
    return players.find(p => p._id?.toString() === id);
}

const createPlayer = async (player: Player) => {
    try {
        await client.connect();
        await client.db("Pokedex").collection("Player").insertOne(player);
        await loadPlayersFromDb();
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const loadPlayersFromDb = async () => {
    try {
        await client.connect();
        players = await client.db("Pokedex").collection("Player").find<Player>({}).toArray();
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

app.get("/", async(req, res) => {
    res.render("index", {
        players: players
    });
});

app.post("/createPlayer", async (req, res) => {
    let name: string = req.body.name;
    await createPlayer({
        name: name
    })
    res.redirect("/");
});

app.get("/player/:id", async(req, res) => {
    let player = getPlayerById(req.params.id);
    if(!player) {
        return res.status(404).send("Player not found");
    }
    res.render("player", {
        player: player
    });
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
    await loadPlayersFromDb();
    console.log("Players loaded from database");
    console.log(`Local url: http://localhost:${app.get("port")}`);
});
