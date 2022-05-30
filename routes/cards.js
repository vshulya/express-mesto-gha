const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { reg } = require('../utils/isLink');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// GET /cards
router.get('/', getCards);

// DELETE /cards/:cardId
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);

// POST /cards
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(reg).required(),
    }),
  }),
  createCard,
);

// PUT /cards/:cardId/likes
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);

// DELETE /cards/:cardId/likes
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
);
module.exports.cardRouter = router;
