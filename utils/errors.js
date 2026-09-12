class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Solicitud incorrecta') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Se requiere autorización') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'No tienes permiso para realizar esta acción') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(message, 409);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
