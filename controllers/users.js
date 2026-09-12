const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const {
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require('../utils/errors');

const SALT_ROUNDS = 10;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Este correo ya está registrado'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Correo o contraseña incorrectos'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Correo o contraseña incorrectos'));
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: '7d',
        });

        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Usuario no encontrado'));
      }
      return res.send({ email: user.email, name: user.name });
    })
    .catch(next);
};
