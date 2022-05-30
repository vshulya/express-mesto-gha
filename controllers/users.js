const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');

const MONGO_DUPLICATE_KEY_CODE = 11000;
// const JWT_SECRET_KEY = 1234567890;

const saltRounds = 10;

// GET /users/me - current user
module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(...user);
    })
    .catch(next);
};

// GET /users/:userId - return user by _id
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch(next);
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     next(new NotFoundError('Пользователь с таким id не найден'));
  //   } else {
  //     next(new ServerError());
  //   }
  // });
};

// GET /users — return users
module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// POST /users — create user
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Не передан email или пароль' });
    return;
  }
  bcrypt.hash(password, saltRounds).then((hash) => {
    // Store hash in your password DB.
    User.create({
      name, about, avatar, email, password: hash,
    })
      // вернём записанные в базу данные
      .then((user) => {
        const { _id } = user;
        res.status(201).send({
          _id,
          name,
          about,
          avatar,
          email,
        });
      })
      // данные не записались, вернём ошибку
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_KEY_CODE) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        }
        next(err);
      });
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорретные данные'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Id пользователя введено некорректно'));
      } else {
        next(new ServerError());
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
      } else {
        next(new ServerError());
      }
    });
};

// login
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'JWT_SECRET_KEY', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};
