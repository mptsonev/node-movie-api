import { authenticationCheckMiddleware } from '../../middleware/authenticationCheck';
import { getMockedRequest, getMockedResponse } from '../testUtils';

describe('Authentication check', () => {
  it('Responds 403 on no credentials', () => {
    const nextCb = jest.fn();
    const mockedRequest = getMockedRequest();
    const mockedResponse = getMockedResponse();
    authenticationCheckMiddleware(mockedRequest, mockedResponse, nextCb);
    expect(mockedResponse.status).toHaveBeenCalledWith(403);
    expect(mockedResponse.json).toHaveBeenCalledWith({
      error: 'No credentials sent!',
    });
    expect(nextCb).toHaveBeenCalledTimes(0);
  });
  it('Continues chain when auth header is present', () => {
    const nextCb = jest.fn();
    const mockedRequest = getMockedRequest({ authorization: 'something' });
    const mockedResponse = getMockedResponse();
    authenticationCheckMiddleware(mockedRequest, mockedResponse, nextCb);
    expect(mockedResponse.status).toHaveBeenCalledTimes(0);
    expect(mockedResponse.json).toHaveBeenCalledTimes(0);
    expect(nextCb).toHaveBeenCalledTimes(1);
  });
});
