const { User } = require('../dataBase');
const {
  passwordHesher, userHelper: { userNormalizator }, photoDirBuilder: { photoDirBuilderT }
} = require('../helpers');
const { mailService } = require('../services');
const { emailActionsEnum: { WELCOME, DELETE, UPDATE }, constant: { USERS, AVATAR } } = require('../constants');
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
      // const { authorization_Token } = authorizationToken();

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
};
