import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pokemon } from "../../types";
import styles from "./PokemonDetailPage.module.css"

const PokemonDetailPage = () => {
    const {id} = useParams();

    const [currentPokemon, setCurrentPokemon] = useState<Pokemon>();

    const loadPokemonById = async(id: number) => {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        let pokemon : Pokemon = await response.json();
        setCurrentPokemon(pokemon);
    }

    useEffect(() => {
        loadPokemonById(Number(id));
    }, [id]);

    return (
        <main>
            {currentPokemon !== undefined && (<article className={styles.pokemonDetail}>
                <img src={currentPokemon.sprites?.front_default}/>
                <p>Name: {currentPokemon.name}</p>
                <p>Weight: {currentPokemon.weight}</p>
                <p>height: {currentPokemon.height}</p>
                <Link to="/pokemon">Back</Link>
            </article>)}
        </main>
    )
}

export default PokemonDetailPage;