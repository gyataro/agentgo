const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Not found." });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  switch (error.name) {
    case "CastError":
      return response.status(400).json({ error: "Malformatted ID." });
    case "Validation Error":
      return response.status(400).json({ error: error.message });
    default:
      next(error);
  }
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
