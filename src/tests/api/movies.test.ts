import { Op } from 'sequelize';
import { createMovieRequest, getMoviesRequest } from '../../api/movies';
import { Role } from '../../api/role';
import { getMockedRequest, getMockedResponse } from '../testUtils';

const testMovie = {
  title: 'Inception',
  genre: 'action, thriller',
  director: 'Christopher Nolan',
  id: 1,
  released: 'Released date',
};

const testTitle = 'Inception';
const testBasicUserName = 'test user name';
const testBasicUserNameLimitted = 'test basic user limitted';

jest.mock('../../sequelize', () => ({
  models: {
    movie: {
      findAll: jest.fn().mockReturnValue([
        {
          title: 'Inception',
          genre: 'action, thriller',
          director: 'Christopher Nolan',
          id: 1,
          released: 'Released date',
        },
      ]),
      count: jest.fn().mockImplementation(clause => {
        if (clause.where.createdBy[Op.eq] === 'test basic user limitted') {
          return 6;
        } else {
          return 4;
        }
      }),
      create: jest.fn().mockImplementation(data => {
        return {
          ...data,
        };
      }),
    },
  },
}));

jest.mock('../../api/omdbClient', () => ({
  getOMDBData: jest.fn().mockImplementation(title => {
    return {
      title,
      genre: 'Some genre',
      director: 'Some guy',
      id: 1,
      released: 'Released date',
    };
  }),
}));

describe('Tests Movie API', () => {
  it('Tests get movies', async () => {
    const mockedResponse = getMockedResponse();
    await getMoviesRequest(mockedResponse);
    expect(mockedResponse.status).toHaveBeenCalledWith(200);
    expect(mockedResponse.json).toHaveBeenCalledWith({ data: [testMovie] });
  });
  it('Tests create invalid body', async () => {
    const mockedResponse = getMockedResponse();
    mockedResponse.locals = {
      role: Role.Basic,
      name: testBasicUserName,
    };
    const mockedRequest = getMockedRequest();
    mockedRequest.body = {
      title: '  ',
    };

    try {
      await createMovieRequest(mockedRequest, mockedResponse);
      fail('It should throw API error');
    } catch (err) {
      const { message, status } = err;
      expect(message).toEqual('Title missing in request body!');
      expect(status).toEqual(400);
    }
  });
  it('Tests limit for basic user reached', async () => {
    const mockedResponse = getMockedResponse();
    mockedResponse.locals = {
      role: Role.Basic,
      name: testBasicUserNameLimitted,
    };
    const mockedRequest = getMockedRequest();
    mockedRequest.body = {
      title: testTitle,
    };
    try {
      await createMovieRequest(mockedRequest, mockedResponse);
      fail('It should throw API error');
    } catch (err) {
      const { message, status } = err;
      expect(message).toEqual(
        'Monthly quota reached, consider upgrading to premium!'
      );
      expect(status).toEqual(402);
    }
  });
  it('Tests create for basic user', async () => {
    const mockedResponse = getMockedResponse();
    mockedResponse.locals = {
      role: Role.Basic,
      name: testBasicUserName,
    };
    const mockedRequest = getMockedRequest();
    mockedRequest.body = {
      title: testTitle,
    };
    try {
      await createMovieRequest(mockedRequest, mockedResponse);
      expect(mockedResponse.status).toHaveBeenCalledWith(201);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        data: {
          title: testTitle,
          genre: 'Some genre',
          director: 'Some guy',
          id: 1,
          released: 'Released date',
        },
      });
    } catch (err) {
      fail('Unexpected error ' + err);
    }
  });
  it('Tests create for premium user', async () => {
    const mockedResponse = getMockedResponse();
    mockedResponse.locals = {
      role: Role.Premium,
      name: testBasicUserNameLimitted,
    };
    const mockedRequest = getMockedRequest();
    mockedRequest.body = {
      title: testTitle,
    };
    try {
      await createMovieRequest(mockedRequest, mockedResponse);
      expect(mockedResponse.status).toHaveBeenCalledWith(201);
      expect(mockedResponse.json).toHaveBeenCalledWith({
        data: {
          title: testTitle,
          genre: 'Some genre',
          director: 'Some guy',
          id: 1,
          released: 'Released date',
        },
      });
    } catch (err) {
      fail('Unexpected error ' + err);
    }
  });
});
