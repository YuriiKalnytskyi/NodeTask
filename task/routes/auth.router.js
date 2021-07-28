const router = require('express').Router();

const { authMiddleware: { checkUser, checkAccessToken, checkRefreshToken } } = require('../middlewares');

const { authController: { login, logout, refresh } } = require('../controllers');

router.post('/login', checkUser, login);
router.post('/logout', checkAccessToken, logout);
router.post('/refresh', checkRefreshToken, refresh);

module.exports = router;
