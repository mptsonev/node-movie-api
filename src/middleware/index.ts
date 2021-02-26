import { authenticationCheckMiddleware } from './authenticationCheck';
import { authorizationCheckMiddleware } from './authorizationCheck';

module.exports = [authenticationCheckMiddleware, authorizationCheckMiddleware];
