const {
  PHOTO_MAX_SIZE, PHOTOS_MIMETYPES, FILE_MAX_SIZE, DOCS_MIMETYPES, VIDEO_MAX_SIZE, VIDEOS_MIMETYPES
} = require('../constants/file.enum');
const {
  statusCode, errorMess: {
    AVATAR, NO_TOKEN, WRONG_TOKEN, RECORD_NOT_FOUND, USER_EMAIL
  }, ErrorHandler
} = require('../errors');
const { userHelper } = require('../helpers');
const { User } = require('../dataBase');
const { idValidator, userValidator } = require('../validators');

module.exports = {
  checkFiles: (req, res, next) => {
    try {
      const files = Object.values(req.files);

      const documents = [];
      const videos = [];
      const photos = [];

      for (let i = 0; i < files.length; i++) {
        const { size, mimetype } = files[i];
        if (PHOTOS_MIMETYPES.includes(mimetype)) {
          if (size > PHOTO_MAX_SIZE) {
            throw new Error('File  is too big');
          }
          photos.push(files[i]);
        } else if (VIDEOS_MIMETYPES.includes(mimetype)) {
          if (size > VIDEO_MAX_SIZE) {
            throw new Error('File  is too big');
          }
          videos.push(files[i]);
        } else if (DOCS_MIMETYPES.includes(mimetype)) {
          if (size > FILE_MAX_SIZE) {
            throw new Error('File  is too big');
          }
          documents.push(files[i]);
        } else {
          throw new Error('Wrong format');
        }
      }
      req.documents = documents;
      req.videos = videos;
      req.photos = photos;
      next();
    } catch (e) {
      next(e);
    }
  },
  checkAvatar: (req, res, next) => {
    try {
      if (req.photos.length > 1) {
        throw new ErrorHandler(statusCode.CONFLICT, AVATAR.message, AVATAR.code);
      }

      [req.avatar] = req.photos;

      next();
    } catch (e) {
      next(e);
    }
  },
  createUserValid: async (req, res, next) => {
    try {
      const { email } = req.body;
      const { authorization_Token } = userHelper.authorizationToken();

      const userObject = { ...req.body, authorization_Token, activatedStatus: false };

      const { error } = await userValidator.createUser.validate(req.body);

      const user = await User.findOne({ email });

      if (error) {
        throw new ErrorHandler(statusCode.NOT_FOUND, error.details[0].message, RECORD_NOT_FOUND.code);
      }
      if (user) {
        throw new ErrorHandler(statusCode.CONFLICT, USER_EMAIL.message, USER_EMAIL.code);
      }
      req.user = userObject;
      next();
    } catch (e) {
      next(e);
    }
  },
  checkAuthorizationToken: async (req, res, next) => {
    try {
      const { token } = req.query;

      if (!token) {
        throw new ErrorHandler(statusCode.NOT_FOUND, NO_TOKEN.message, NO_TOKEN.code);
      }
      await userHelper.verifyAuthorizationToken(token);

      const user = await User.findOne({ authorization_Token: token });

      if (!user) {
        throw new ErrorHandler(statusCode.NOT_FOUND, WRONG_TOKEN.message, WRONG_TOKEN.code);
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  },
  checkUserIdValid: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const { error } = await idValidator.id.validate(userId);

      const user = await User.findById(userId);

      if (error) {
        throw new ErrorHandler(statusCode.NOT_FOUND, error.details[0].message, RECORD_NOT_FOUND.code);
      }
      if (!user) {
        throw new ErrorHandler(statusCode.NOT_FOUND, RECORD_NOT_FOUND.message, RECORD_NOT_FOUND.code);
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  },
  updateUser: (req, res, next) => {
    try {
      const { error } = userValidator.updateUser.validate(req.body);

      if (error) {
        throw new ErrorHandler(statusCode.NOT_FOUND, error.details[0].message, RECORD_NOT_FOUND.code);
      }
      next();
    } catch (e) {
      next(e);
    }
  },
 changePassword: (req, res, next) => {
    try {
      const { } = req.body

    } catch (e) {
      next(e);
    }
  },
  forgotPassword: (req, res, next) => {
    try {

    } catch (e) {
      next(e);
    }
  }
};
