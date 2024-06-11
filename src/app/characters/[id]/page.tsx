'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Character, fetchCharacterById, fetchComicsByCharacterId } from '@/utils/api';
import { useRouter } from 'next/navigation'; 
import "./index.css";

export default function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [comics, setComics] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const characterData = await fetchCharacterById(Number(id));
          setCharacter(characterData);

          const comicsResponse = await fetchComicsByCharacterId(Number(id));
          setComics(comicsResponse.data.results.slice(0, 10));
        } catch (error) {
          console.error('Error fetching character:', error);
        }
      };

      fetchData();
    }
  }, [id]);

  function backToHome(){
    router.push(`/`);

  }
  
  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="character-detail-container">
      <header className="header">
        <span className="back" onClick={() => backToHome()}>voltar</span>
      </header>
      <div className="character-detail">
        <div className="character-info">
          <h1>{character.name}</h1>
          <p>{character.description}</p>
          <div className="stats">
            <div>
              <span>Quadrinhos </span>
              <span>{character.comics.available}</span>
            </div>
          </div>
        </div>
        <div className="character-image">
          <img src={`${character.thumbnail?.path}.${character.thumbnail?.extension}`} alt={character.name} />
        </div>
      </div>
      <div className="comics-section">
        <h2>Últimos lançamentos</h2>
        <div className="comics-container">
          {comics.map((comic) => (
            <div key={comic.id} className="comic-card">
              <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
              <p>{comic.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
