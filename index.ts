import axios from "axios";
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
    pokemon: Pokemon[]
}

interface Pokemon {
    id: number;
    name: string;
    types: string[];
    image: string;
    height: number;
    weight: number;
    maxHp: number;
    currentHp?: number;
}

let players: Player[] = [];
let allPokemon: Pokemon[] = [];

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

const updatePlayer = async (player: Player) => {
    try {
        await client.connect();

        await client.db("Pokedex").collection("Player").updateOne({_id : player._id},{$set: {
            pokemon: player.pokemon
        }});
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const loadPokemonFromDb = async () => {
    try {
        await client.connect();
        let dbPokemon = await client.db("Pokedex").collection("Pokemon").find<Pokemon>({}).toArray();

        if (dbPokemon.length > 0) {
            console.log("Pokemon found in db... using these");
            allPokemon = dbPokemon;
        } else {
            let response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
    
            for(let p of response.data.results) {
                let response = await axios.get(p.url);
                
                let pokemon : Pokemon = {
                    id: response.data.id,
                    name: response.data.name,
                    types: response.data.types.map((t: any) => t.type.name),
                    image: response.data.sprites.front_default,
                    height: response.data.height,
                    weight: response.data.weight,
                    maxHp: response.data.stats.find((s: any) => s.stat.name =="hp")?.base_stat
                }
        
                allPokemon = [...allPokemon, pokemon];
            }
        }

        await client.db("Pokedex").collection("Pokemon").insertMany(allPokemon);

        console.log("Pokemon found in db... using these");

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
        name: name,
        pokemon: []
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
    let player = getPlayerById(req.params.id);
    let filter : string = req.query.filter as string;
    if(!player) {
        return res.status(404).send("Player not found");
    }

    let filteredPokemon = allPokemon.filter(pokemon => {
        return !player?.pokemon.find(p => p.id === pokemon.id)
    });

    if (filter) {
        filteredPokemon = filteredPokemon.filter(pokemon => pokemon.types.includes(filter));
    }

    let types : string[] = (player.pokemon.length > 0) ? Array.from(new Set(player.pokemon.reduce((prev: string[], curr: Pokemon) => [...prev, ...curr.types], []))) : [];

    let largest = (player.pokemon.length > 0) ? (player.pokemon.reduce((prev, curr) => curr.height > prev.height ? curr : prev)) : undefined;
    let smallest = (player.pokemon.length > 0) ? (player.pokemon.reduce((prev, curr) => curr.height < prev.height ? curr : prev)) : undefined;

    res.render("pokemon", {
        allPokemon: filteredPokemon,
        player: player,
        smallest: smallest,
        largest: largest,
        types: types
    });
});

app.post("/player/:id/save", async(req, res) => {
    let player = getPlayerById(req.params.id);
    if(!player) {
        return res.status(404).send("Player not found");
    }
    await updatePlayer(player);
    res.redirect(`/player/${player._id}`);
});

app.post("/player/:id/pokemon/add/:pokeId", async(req, res) => {
    let player = getPlayerById(req.params.id);
    let pokemon: Pokemon | undefined = allPokemon.find(p => p.id === parseInt(req.params.pokeId));
    if(!player) {
        return res.status(404).send("Player not found");
    }
    if(!pokemon) {
        return res.status(404).send("Pokemon not found");
    }

    pokemon.currentHp = Math.floor(Math.random() * pokemon.maxHp);
    player.pokemon = [pokemon, ...player.pokemon.slice(0,5)];

    res.redirect(`/player/${player._id}/pokemon`);
});

app.post("/player/:id/pokemon/delete/:pokeId", async (req, res) => {
    let player = getPlayerById(req.params.id);
    let pokemon: Pokemon | undefined = allPokemon.find(p => p.id === parseInt(req.params.pokeId));
    if(!player) {
        return res.status(404).send("Player not found");
    }
    if(!pokemon) {
        return res.status(404).send("Pokemon not found");
    }

    player.pokemon = player.pokemon.filter(p => p.id !== parseInt(req.params.pokeId))
    res.redirect(`/player/${player._id}/pokemon`);

});


app.listen(app.get("port"), async () => {
    await loadPlayersFromDb();
    console.log(`${players.length} players loaded from the database`);
    await loadPokemonFromDb();
    console.log(`${allPokemon.length} pokemon loaded from the database/api`);
    console.log(`Local url: http://localhost:${app.get("port")}`);
});
