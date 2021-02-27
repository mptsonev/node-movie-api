import { getOMDBData } from '../../api/omdbClient';

describe('Test OMDB data', () => {
  it('Parses correct OMDB movie data', async () => {
    const data = await getOMDBData('Inception');
    expect(data).toEqual({
      title: 'Inception',
      released: new Date('16 Jul 2010'),
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
