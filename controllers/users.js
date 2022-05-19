const User = require('../models/user');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// GET /users/:userId - return user by _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

// GET /users — return users
module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// POST /users — create user
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.status(201).send(user))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.code === 403) {
        next(new ForbiddenError('Ошибка валидации'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      }
    });
};

// PATCH /users/me — update profile
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
  })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 403) {
        next(new ForbiddenError('Ошибка валидации'));
      }
    });
};

// PATCH /users/me/avatar — update avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 403) {
        next(new ForbiddenError('Ошибка валидации'));
      }
    });
};
