import axios from "axios";

const BASE_URL = 'https://gateway.marvel.com/v1/public/characters';
const API_KEY = '18bf4afc2685158de3bbcdbae8e4ea2d';
const HASH_KEY = '3b90f992d52ec188972c640a8eaf8b8f';
const TS = -3;

export interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
}
  
  export interface MarvelApiResponse {
    data: {
      results: Character[];
    };
  }
export const fetchMarvelCharacters = async (): Promise<Character[]> => {
    try {
      const response = await axios.get<MarvelApiResponse>(BASE_URL, {
        params: {
          apikey: API_KEY,
          hash: HASH_KEY,
          ts: TS,
        },
      });
      return response.data.data.results;
    } catch (error) {
      console.error('Error fetching data from Marvel API:', error);
      throw error;
    }
  };
  

 export const fetchCharacterById = async (id: number): Promise<Character> => {
    try {
  
      const response = await axios.get(`${BASE_URL}/${id}`, {
        params: {
            apikey: API_KEY,
            hash: HASH_KEY,
            ts: TS
        },
      });
  
      return response.data.data.results[0];
    } catch (error) {
      console.error('Error fetching character data from Marvel API:', error);
      throw error;
    }
  };

  export const fetchComicsByCharacterId = async (id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}/comics`, {
        params: {
          apikey: API_KEY,
          hash: HASH_KEY,
          ts: TS,
          orderBy: 'onsaleDate',
          limit: 10
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comics data from Marvel API:', error);
      throw error;
    }
  };
  
    export const fetchMarvelCharacterByName = async (name: string): Promise<Character[]> => {
      try {
        const response = await axios.get<MarvelApiResponse>(BASE_URL, {
          params: {
            apikey: API_KEY,
            hash: HASH_KEY,
            ts: TS,
            name
          },
        });
        return response.data.data.results;
      } catch (error) {
        console.error('Error fetching data from Marvel API:', error);
        throw error;
      }
    };