const router = require('express').Router();

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
router.get('/:id', getUser);

// PATCH /users/me — update profile
router.patch('/me', updateUser);

// PATCH /users/me/avatar — update avatar
router.patch('/me/avatar', updateAvatar);

module.exports.userRouter = router;
