const router = require('express').Router();

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
router.delete('/:cardId', deleteCard);

// POST /cards
router.post('/', createCard);

// PUT /cards/:cardId/likes
router.put('/:cardId/likes', likeCard);

// DELETE /cards/:cardId/likes
router.delete('/:cardId/likes', dislikeCard);
module.exports.cardRouter = router;
