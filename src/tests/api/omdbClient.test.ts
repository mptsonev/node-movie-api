import { getOMDBData } from '../../api/omdbClient';

describe('Test OMDB data', () => {
  it('Parses correct OMDB movie data', async () => {
    const data = await getOMDBData('Inception');
    expect(data).toEqual({
      title: 'Inception',
      released: '2010-07-15T21:00:00.000Z',
      genre: 'Action, Adventure, Sci-Fi, Thriller',
      director: 'Christopher Nolan',
    });
  });
  it('Rejects incorrect OMDB movie data', async () => {
    try {
      await getOMDBData('Inception123');
    } catch (err) {
      expect(err).toEqual('Failed to get OMDB data');
    }
  });
});
