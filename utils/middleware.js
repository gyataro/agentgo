const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Not found." });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  switch (error.name) {
    case "CastError":
      return response.status(400).json({ error: "Malformatted ID." });
    case "ValidationError":
      return response.status(400).json({ error: error.message });
    default:
      next(error);
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
