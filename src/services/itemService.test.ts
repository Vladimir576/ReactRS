import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchItems } from './itemService';

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
