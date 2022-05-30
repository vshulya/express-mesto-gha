const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { reg } = require('../utils/isLink');

const {
  getMe,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// GET /users/me - current user
router.get('/me', getMe);

// GET /users — return users
router.get('/', getUsers);

// GET /users/:userId - return user by _id
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser,
);

// PATCH /users/me — update profile
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

// PATCH /users/me/avatar — update avatar
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(reg).required(),
    }),
  }),
  updateAvatar,
);

module.exports.userRouter = router;
