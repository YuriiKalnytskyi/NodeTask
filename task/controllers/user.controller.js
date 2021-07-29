const { User } = require('../dataBase');
const {
  passwordHesher, userHelper: { userNormalizator }, photoDirBuilder: { photoDirBuilderT }
} = require('../helpers');
const { mailService } = require('../services');
const {
  emailActionsEnum: {
    WELCOME, DELETE, UPDATE, FORGOT_PASSWORD, PASSWORD_CHANGED
  }, constant: { USERS, AVATAR, PHOTO }
} = require('../constants');
const { statusCode } = require('../errors');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find({}).lean();
      res.json(users);
    } catch (e) {
      next(e);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const { avatar, user: { password, email, name } } = req;

      const hashedPassword = await passwordHesher.hash(password);

      const createdUser = await User.create({
        ...req.user,
        password: hashedPassword,
      });

      const { _id } = createdUser;

      if (avatar) {
        const { finalPath, photoPath } = await photoDirBuilderT(avatar.name, _id, USERS, AVATAR);

        await avatar.mv(finalPath);
        await User.updateOne({ _id }, { avatar: photoPath });
      }
      await mailService.sendMail(email, WELCOME, { userName: name, authorization_Token: createdUser.authorization_Token });

      const a = userNormalizator(createdUser.toJSON());

      res.status(statusCode.CREATED).json(a);
    } catch (e) {
      next(e);
    }
  },
  getUserId: (req, res, next) => {
    try {
      const { user } = req;

      res.json(user);
    } catch (e) {
      next(e);
    }
  },
  deleteUserId: async (req, res, next) => {
    try {
      const { user: { email, id } } = req;
      console.log(email);
      console.log(id);
      await User.findByIdAndDelete({ _id: id });
      await mailService.sendMail(email, DELETE, { userName: email });

      res.json('deleteUser');
    } catch (e) {
      next(e);
    }
  },
  updateUserById: async (req, res, next) => {
    try {
      const { password, email, id } = req.user;

      if (password) {
        const hashedPassword = await passwordHesher.hash(password);
        req.body = { ...req.body, password: hashedPassword };
      }
      await User.updateOne({ _id: id }, req.body);
      await mailService.sendMail(email, UPDATE, { userName: email });

      res.status(statusCode.UPDATED).json('user update');
    } catch (e) {
      next(e);
    }
  },
  activatedStatus: async (req, res, next) => {
    try {
      const { _id } = req.user;

      await User.updateOne({ _id }, { activatedStatus: true, authorization_Token: null });
    } catch (e) {
      next(e);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { user: { email, forgot_Token } } = req;
      await mailService.sendMail(email, FORGOT_PASSWORD, { userName: email, forgot_Token });

      res.json('forgot password');
    } catch (e) {
      next(e);
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { user: { _id, email }, password } = req.user;

      const hashedPassword = await passwordHesher.hash(password);

      await User.updateOne({ _id }, { password: hashedPassword, forgot_Token: null });

      await mailService.sendMail(email, PASSWORD_CHANGED, { userName: email, });

      res.json('user update password');
    } catch (e) {
      next(e);
    }
  },
  addAvatar: async (req, res, next) => {
    try {
      const { files: { avatar }, user: { _id }, user } = req;

      if (avatar) {
        const { finalPath, photoPath } = await photoDirBuilderT(avatar.name, _id, USERS, AVATAR);
        await avatar.mv(finalPath);
        await User.updateOne({ _id }, { avatar: photoPath });
      }
      res.json(user);
    } catch (e) {
      next(e);
    }
  },
  addPhotos: async (req, res, next) => {
    try {
      const { photos, user: { _id } } = req;
      const arr = [];

      if (photos.length) {
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];

          // eslint-disable-next-line no-await-in-loop
          const { finalPath, photoPath } = await photoDirBuilderT(photo.name, _id, USERS, PHOTO);

          // eslint-disable-next-line no-await-in-loop
          await photo.mv(finalPath);

          arr.push(photoPath);
        }
        await User.updateOne({ _id }, { $push: { photo: arr } });
      }
      res.json('add photos');
    } catch (e) {
      next(e);
    }
  }

};
