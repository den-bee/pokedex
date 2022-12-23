import React, { useContext, useEffect } from 'react';
import {Link} from "react-router-dom";
import {useState} from "react";
import { Pokemon , PokemonRoot} from '../../types';
import pokemonDetailPage from '../PokemonDetailPage/PokemonDetailPage';
import styles from "./PokemonListPage.module.css";
import logo from './logo.svg';
import DataContext from '../../DataContext';

const PokemonListPage = () => {

    const {pokemon} = useContext(DataContext);

    const [filter, setFilter] = useState("");

    const filteredPokemon = pokemon.filter(p => p.name.toUpperCase().startsWith(filter.toUpperCase()));

    return (
        <main>
            <input type="text" className={styles.search} value={filter} onChange={e => setFilter(e.target.value)}/>
            {filteredPokemon.map(pokemon => (
                <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id} className={styles.listItem}>{pokemon.name}</Link>
            ))}
        </main>
    )
}

export default PokemonListPage;