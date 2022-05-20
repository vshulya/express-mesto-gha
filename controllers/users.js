const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
// const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');

// GET /users/:userId - return user by _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Id пользователя введено некорректно'));
      } else {
        next(new ServerError());
      }
    });
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
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при создании карточки'));
      }
    });
};

// PATCH /users/me — update profile
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, runValidators: true,
  })
    .then((user) => {
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорретные данные'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Id пользователя введено некорректно'));
      }
    });
};

// PATCH /users/me/avatar — update avatar
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорретные данные'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Id пользователя введено некорректно'));
      }
    });
};
