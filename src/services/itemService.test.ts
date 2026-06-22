import { fetchItemById, fetchItems } from './itemService';

const createResponse = (ok: boolean, status: number, payload: unknown): Response =>
  ({
    ok,
    status,
    json: vi.fn().mockResolvedValue(payload),
  }) as unknown as Response;

describe('fetchItems', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads characters from API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createResponse(true, 200, {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      })
    );

    await expect(fetchItems({ query: ' rick ', page: 2 })).resolves.toEqual([]);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=rick&page=2'
    );
  });

  it('throws for server errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(createResponse(false, 500, {}));

    await expect(fetchItems({ query: 'rick' })).rejects.toThrow(
      'Server returned an error while loading items.'
    );
  });
});

describe('fetchItemById', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads one character by id', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      createResponse(true, 200, {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      })
    );

    await expect(fetchItemById(1)).resolves.toEqual({
      id: 1,
      name: 'Rick Sanchez',
      description: 'Human - Alive - Male',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1'
    );
  });

  it('throws when details request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(createResponse(false, 500, {}));

    await expect(fetchItemById(1)).rejects.toThrow(
      'Server returned an error while loading item details.'
    );
  });
});
