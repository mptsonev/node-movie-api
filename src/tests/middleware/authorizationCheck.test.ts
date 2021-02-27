import jwt from 'jsonwebtoken';
import { authorizationCheckMiddleware } from '../../middleware/authorizationCheck';
import { getMockedRequest, getMockedResponse } from '../testUtils';

describe('Authorization check', () => {
  it('Verifies a correct token', () => {
    const testRole = 'basic';
    const testUserName = 'test user';
    const user = {
      id: 1,
      name: testUserName,
      role: testRole,
    };
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        issuer: 'https://www.testsite.com/',
        subject: `${user.id}`,
        expiresIn: 30 * 60,
      }
    );

    const nextCb = jest.fn();
    const mockedRequest = getMockedRequest({ authorization: token });
    const mockedResponse = getMockedResponse();
    authorizationCheckMiddleware(mockedRequest, mockedResponse, nextCb);
    expect(nextCb).toHaveBeenCalledTimes(1);
    const { role, name } = mockedResponse.locals;
    expect(role).toEqual(testRole);
    expect(name).toEqual(testUserName);
  });
  it('Invalidates incorrect token', () => {
    const nextCb = jest.fn();
    const mockedRequest = getMockedRequest({
      authorization: 'some invalid token',
    });
    const mockedResponse = getMockedResponse();
    authorizationCheckMiddleware(mockedRequest, mockedResponse, nextCb);
    expect(mockedResponse.status).toHaveBeenCalledWith(403);
    expect(mockedResponse.json).toHaveBeenCalledWith({
      error: 'Invalid Token!',
    });
    expect(nextCb).toHaveBeenCalledTimes(0);
  });
});
