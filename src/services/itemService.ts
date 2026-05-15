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
  return `${character.species} • ${character.status} • ${character.gender}`;
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
  return payload.results.map((character) => ({
    id: character.id,
    name: character.name,
    description: buildDescription(character),
  }));
}
