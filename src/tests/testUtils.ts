import { Request, Response } from 'express';

export const getMockedResponse = (): Response => {
  const mockedResponse = {} as Response;
  mockedResponse.json = jest.fn().mockReturnValue(mockedResponse);
  mockedResponse.status = jest.fn().mockReturnValue(mockedResponse);
  return mockedResponse;
};

export const getMockedRequest = (headers: any = {}): Request => {
  const mockedRequest = {
    headers,
  } as Request;
  return mockedRequest;
};
