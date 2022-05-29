const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

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
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные при создании карточки'));
      } else {
        next(new ServerError());
      }
    });
};

// DELETE /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка  не найдена'));
      }
      if (req.user._id === card.owner.toString()) {
        return card.remove()
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          });
      }
      return next(new ForbiddenError('Нет прав для удаления этой карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный Id'));
      } else {
        next(new ServerError());
      }
    });
};

// PUT /cards/:cardId/likes
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((like) => {
      if (!like) {
        next(new NotFoundError('Карточки не существует'));
      } res.send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный Id'));
      }
      next(err);
    });
};

// DELETE /cards/:cardId/likes
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        throw new NotFoundError('Переданный id не найден');
      }
      res.send({ data: like });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Передан некорректный Id'));
      }
      next(err);
    });
};
