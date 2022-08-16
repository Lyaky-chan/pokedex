import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import PokemonCollection from './components/PokemonCollection';
import { Pokemon } from './interface';
import "./styles/PokemonCollection.css";

interface Pokemons {
  name: string
  url: string
}

function App() {
  // State
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");

  // Comportement
  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios
        .get("https://pokeapi.co/api/v2/pokemon?limit=5&offset=0")

      setNextUrl(res.data.next)/* 
      console.log("OK", res.data.results) */

      res.data.results.forEach(async (pokemon: Pokemons) => {
        const poke = await axios
          .get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)

        setPokemons((p) => [...p, poke.data])
      });
    }
    getPokemon();
  }, []);

  /* console.log(nextUrl); */
  const handleNextPage = async () => {
    let res = await axios.get(nextUrl)

    setNextUrl(res.data.next)

    res.data.results.forEach(async (pokemon: Pokemons) => {
      const poke = await axios
        .get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)

      setPokemons((p) => [...p, poke.data])
    });
  }

  // Affichage
  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header">Pokemon</header>
        <PokemonCollection pokemons={pokemons} />
        <button onClick={handleNextPage}>Charger</button>
      </div>
    </div>
  );
}

export default App;
