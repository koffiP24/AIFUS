class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

const isHttpError = (error) =>
  error instanceof HttpError ||
  (typeof error?.statusCode === "number" && typeof error?.message === "string");

const sendHttpError = (res, error) => {
  if (isHttpError(error)) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details || undefined,
    });
  }

  console.error(error);
  return res.status(500).json({ message: "Erreur serveur" });
};

module.exports = {
  HttpError,
  isHttpError,
  sendHttpError,
};
