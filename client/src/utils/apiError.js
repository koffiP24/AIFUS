export const getApiErrorMessage = (
  error,
  defaultMessage = "Une erreur est survenue.",
) => {
  const response = error?.response?.data;
  if (!response) {
    return defaultMessage;
  }

  if (typeof response.message === "string" && response.message) {
    return response.message;
  }

  if (Array.isArray(response.errors)) {
    return response.errors
      .map((errorItem) => errorItem.msg || errorItem.message || errorItem)
      .join(", ");
  }

  if (typeof response === "string") {
    return response;
  }

  return defaultMessage;
};
