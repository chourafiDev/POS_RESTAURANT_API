import ErrorHandler from "../utils/ErrorHandler";

const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = { ...err };
  error.message = err.message;

  //Wrong Mongoose Object ID Error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    const message = `Resource not found. Invalide: ${err.path}`;
    error = new ErrorHandler(message, 400);
  }

  //Handling Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  //Handling Mongoose Validation Error
  if (err.code === 11000) {
    const message = `Certaines valeurs ne peuvent pas être dupliquées`;
    error = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error,
    message: error.message,
    stack: error.stack,
  });
};

export default onError;

export { notFound, errorHandler };
