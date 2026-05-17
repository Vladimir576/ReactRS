import type { Item } from '../types/types';

export interface FetchOptions {
  query?: string;
  page?: number;
}

interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface RickAndMortyResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickAndMortyCharacter[];
}

function buildDescription(character: RickAndMortyCharacter): string {
  return `${character.species} - ${character.status} - ${character.gender}`;
}

function makeItem(character: RickAndMortyCharacter): Item {
  return {
    id: character.id,
    name: character.name,
    description: buildDescription(character),
    image: character.image,
  };
}

export async function fetchItems(options: FetchOptions): Promise<Item[]> {
  const page = options.page ?? 1;
  const query = (options.query ?? '').trim();
  const params = new URLSearchParams();

  if (query) {
    params.set('name', query);
  }

  params.set('page', String(page));
  const url = `https://rickandmortyapi.com/api/character/?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error('Server returned an error while loading items.');
  }

  const payload = (await response.json()) as RickAndMortyResponse;
  return payload.results.map(makeItem);
}

export async function fetchItemById(id: number): Promise<Item> {
  const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

  if (!response.ok) {
    throw new Error('Server returned an error while loading item details.');
  }

  const character = (await response.json()) as RickAndMortyCharacter;
  return makeItem(character);
}
