import React, { useEffect } from 'react';
import {createBrowserRouter, RouterProvider, Link} from "react-router-dom";
import {useState} from "react";
import { Pokemon , PokemonRoot} from './types';
import DataContext from './DataContext';
import HomePage from './components/HomePage/HomePage';
import PokemonListPage from './components/PokemonListPage/PokemonListPage';
import PokemonDetailPage from './components/PokemonDetailPage/PokemonDetailPage';
import Root from './components/Root/Root';
import "./App.css";
import logo from './logo.svg';

const getIdFromUrl = (url: string) => 
  parseInt(url.replace("https://pokeapi.co/api/v2/pokemon/", "").substring(-1));

const App = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  
  

  const loadPokemon = async() => {
      let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1154");
      let pokemonRoot : PokemonRoot = await response.json();

      setPokemon(pokemonRoot.results.map(pokemon => {
          return {...pokemon, id: getIdFromUrl(pokemon.url!)};
      }));
  }

  useEffect(() => {
      loadPokemon();
  }, []);

    const router = createBrowserRouter([
      {
        path: "/",
        element: <Root/>,
        children: [
          {
            path: "",
            element: <HomePage/>
          },
          {
            path: "pokemon",
            element: <PokemonListPage/>
          }, 
          {
            path: "pokemon/:id",
            element: <PokemonDetailPage/>
          }
        ]
      }
    ])

    return (
      <div>
        <DataContext.Provider value={{pokemon: pokemon}}>
          <RouterProvider router={router}/>
        </DataContext.Provider>
      </div>
    )
}

export default App;