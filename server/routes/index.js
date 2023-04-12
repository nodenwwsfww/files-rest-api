import express from 'express';
const router = express.Router();
import {passwordAndIdValidationChain} from '../users/users.validator';
import UsersController from '../users/users.controller';
import {verifyAccessToken} from '../auth/auth.middleware';
import AuthController from '../auth/auth.controller';

/* GET home page. */
router.get('/', function(req, res) {
  res.send('Open index page');
});

/* GET user id */
router.get('/info', verifyAccessToken, UsersController.getUserInfo);

/* Register a new user. */
router.post('/signup', ...passwordAndIdValidationChain, UsersController.signup);
/* Logout (reset JWT token). */
router.get('/logout', verifyAccessToken, AuthController.logout);

router.get('/latency', verifyAccessToken, (req, res) => {
  const delay = req.query.delay || 1000; // default delay is 1 second
  setTimeout(() => {
    res.status(200).json({ message: 'Latency test confirmed' });
  }, delay);
});

export default router;
