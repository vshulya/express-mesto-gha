const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62852bb7291fda2c996a69c8', // вставьте сюда _id созданного пользователя
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);

mongoose.connect('mongodb://localhost:27017/mestodb');

const errorHandler = (err, req, res, next) => {
  res.status(err.code).res.send({ message: err.message });
  next();
};

app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log('Server has been started');
});
