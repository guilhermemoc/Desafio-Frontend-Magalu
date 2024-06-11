import { Character } from "@/utils/api";
import "./index.css";

interface CardProps {
  character: Character;
  isFavorite: boolean;
  toggleFavorite: () => void;
  onClick: () => void;
}

export default function Card({ character, isFavorite, toggleFavorite, onClick }: CardProps) {
  return (
    <div className="card" onClick={onClick}>
      <img 
        src={`${character?.thumbnail?.path}.${character?.thumbnail?.extension}`} 
        alt={character.name} 
      />
      <h2>{character.name}</h2>
      <button className={`favorite-button ${isFavorite ? 'favorited' : ''}`} onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}>
        {isFavorite ? '❤️' : '♡'}
      </button>
    </div>
  );
}
