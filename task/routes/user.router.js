const router = require('express').Router();

const {
  userMiddleware: {
    checkFiles, checkAvatar, checkAuthorizationToken, checkUserIdValid, createUserValid, updateUser
  }, authMiddleware: { checkAccessToken }
} = require('../middlewares');

const {
  getAllUsers, createUser, activatedStatus, getUserId, deleteUserId, updateUserById
} = require('../controllers/user.controller');

router.get('/', getAllUsers);
router.post('/', checkFiles, checkAvatar, createUserValid, createUser);
router.get('/authorization', checkAuthorizationToken, activatedStatus);
router.get('/:userId', checkUserIdValid, getUserId);
router.delete('/:userId', checkAccessToken, checkUserIdValid, deleteUserId);
router.patch('/:userId', checkAccessToken, checkUserIdValid, updateUser, updateUserById);
router.post('/changePassword');
router.post('/forgotPassword');

module.exports = router;
