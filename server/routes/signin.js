import express from 'express';
import {passwordAndIdValidationChain} from '../users/users.validator';
import UsersController from '../users/users.controller';
import AuthController from '../auth/auth.controller';
import {verifyRefreshToken} from '../auth/auth.middleware';
const router = express.Router();

/* Get bearer token by id & password. */
router.post('/',
    ...passwordAndIdValidationChain,
    UsersController.signin);

/* Get bearer token by refresh token. */
router.post('/new_token',
    verifyRefreshToken, AuthController.signinNewToken
);

export default router;
