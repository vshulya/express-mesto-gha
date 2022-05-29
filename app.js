const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

const {
  login,
  createUser,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const app = express();

app.use(express.json());

// routes w/o auth
app.post('/signin', login);
app.post('/signup', createUser);

// routes w/ auth
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Такого адреса не существует'));
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log('Server has been started');
});
