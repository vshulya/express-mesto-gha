const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// GET /cards
module.exports.getCards = (_, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

// POST /cards
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id; // _id станет доступен
  const { name, link } = req.body;

  Card.create({
    name, link, owner, likes: [],
  })
    // вернём записанные в базу данные
    .then((card) => res.status(201).send(card))
    // данные не записались, вернём ошибку
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.code === 403) {
        next(new ForbiddenError('Некорректные данные при создании карточки'));
      }
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточки не существует'));
      }
      if (req.user._id !== card.owner.toString()) {
        next(new ForbiddenError('У вас нет доступа к удалению этой карточки'));
      }
      res.send({ card });
    })
    .catch(next);
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточки не существует'));
      } res.send(card);
    })
    .catch(next);
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточки не существует'));
      } res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
