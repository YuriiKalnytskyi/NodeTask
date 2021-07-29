const router = require('express').Router();

const {
  userMiddleware: {
    checkFiles, checkAvatar, checkAuthorizationToken, checkUserIdValid, createUserValid, updateUser,
    changePasswordValid, forgotPasswordValid
  }, authMiddleware: { checkAccessToken }
} = require('../middlewares');

const {
  getAllUsers, createUser, activatedStatus, getUserId, deleteUserId, updateUserById, changePassword, forgotPassword,
  addAvatar, addPhotos
} = require('../controllers/user.controller');

router.get('/', getAllUsers);
router.post('/', checkFiles, checkAvatar, createUserValid, createUser);
router.get('/:userId', checkUserIdValid, getUserId);
router.delete('/:userId', checkAccessToken, checkUserIdValid, deleteUserId);
router.patch('/:userId', checkAccessToken, checkUserIdValid, updateUser, updateUserById);
router.post('/:userId/avatar', checkUserIdValid, checkFiles, checkAvatar, addAvatar);
router.post('/:userId/photos', checkUserIdValid, checkFiles, addPhotos);
router.get('/authorization', checkAuthorizationToken, activatedStatus);
router.post('/changePassword', changePasswordValid, changePassword);
router.post('/forgotPassword', forgotPasswordValid, forgotPassword);

module.exports = router;
