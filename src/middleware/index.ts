import { authenticationCheckMiddleware } from './authenticationCheck';
import { authorizationCheckMiddleware } from './authorizationCheck';

export default [authenticationCheckMiddleware, authorizationCheckMiddleware];
