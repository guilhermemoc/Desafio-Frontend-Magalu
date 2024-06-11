'use client';

import Card from "@/components/card";
import { Character, fetchMarvelCharacters, fetchMarvelCharacterByName } from "@/utils/api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation'; 
import "./index.css";

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const hasFetched = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const newCharacters = await fetchMarvelCharacters();
        setCharacters(prevCharacters => [...prevCharacters, ...newCharacters]);
      } catch (error) {
        console.error('Error fetching Marvel characters:', error);
      }
      setLoading(false);
    };

    if (!hasFetched.current && !showFavorites) {
      hasFetched.current = true;
      fetchData();
    }
  }, [showFavorites]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const handleCardClick = (id: number) => {
    router.push(`/characters/${id}`);
  };

  const toggleFavorite = (character: Character) => {
    let updatedFavorites;
    if (favorites.some(fav => fav.id === character.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== character.id);
    } else {
      if (favorites.length >= 5) {
        alert('Você pode favoritar no máximo 5 personagens.');
        return;
      }
      updatedFavorites = [...favorites, character];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const toggleShowFavorites = () => {
    setShowFavorites(prevShowFavorites => !prevShowFavorites);
  };

  const searchCharacter = async () => {
    setLoading(true);
    try {
      const character = await fetchMarvelCharacterByName(searchTerm);
      setCharacters(character); 
    } catch (error) {
      console.error('Error fetching Marvel character by name:', error);
      setCharacters([]); 
    }
    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchCharacter();
  };
  

  const displayedCharacters = showFavorites ? favorites : characters;

  return (
    <div className='container'>
      <main>
        <img src="/img/logo.svg" alt="Marvel" className='logo'/>

        <h1>EXPLORE O UNIVERSO</h1>
        <p>Mergulhe no domínio deslumbrante de todos os personagens clássicos que você ama - e aqueles que você descobrirá em breve!</p>
        <div className='search-bar'>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Procure por herois" className='search-input' value={searchTerm} onChange={handleChange} />
          <button type="submit">Search</button>
        </form>
        </div>
        <div className='info-bar'>
          <span>Encontrados {displayedCharacters.length} heróis</span>
          <div className='filter-options'>
            <span className='favorite-toggle' onClick={toggleShowFavorites}>
              {showFavorites ? 'Todos' : 'Somente favoritos'}
            </span>
          </div>
        </div>
        <div className='card-container'>
          {displayedCharacters.map((character, index) => (
            <div
              key={character.id}
              onClick={() => handleCardClick(character.id)}
              className='card-wrapper'
            >
              <Card 
                character={character} 
                isFavorite={favorites.some(fav => fav.id === character.id)}
                toggleFavorite={() => toggleFavorite(character)} 
                onClick={() => handleCardClick(character.id)}
              />
            </div>
          ))}
        </div>
        {loading && <p>Loading more characters...</p>}
      </main>
    </div>
  );
}
