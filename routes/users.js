const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// GET /users — return users
router.get('/', getUsers);

// GET /users/:userId - return user by _id
router.get('/:id', getUser);

// POST /users — create user
router.post('/', createUser);

// PATCH /users/me — update profile
router.patch('/me', updateUser);

// PATCH /users/me/avatar — update avatar
router.patch('/me/avatar', updateAvatar);

module.exports.userRouter = router;