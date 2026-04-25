const sanitizeForJson = (value) => {
  const seen = new WeakSet();

  const visit = (input) => {
    if (input == null) {
      return input;
    }

    if (typeof input === "function" || typeof input === "symbol") {
      return undefined;
    }

    if (typeof input === "bigint") {
      return input.toString();
    }

    if (input instanceof Date) {
      return input.toISOString();
    }

    if (Array.isArray(input)) {
      return input
        .map((item) => visit(item))
        .filter((item) => item !== undefined);
    }

    if (typeof input === "object") {
      if (seen.has(input)) {
        return undefined;
      }

      seen.add(input);

      if (typeof input.toJSON === "function") {
        try {
          return visit(input.toJSON());
        } catch (_error) {
          // Fall through to a plain object traversal if toJSON fails.
        }
      }

      return Object.fromEntries(
        Object.entries(input).flatMap(([key, nestedValue]) => {
          const serializedValue = visit(nestedValue);
          return serializedValue === undefined ? [] : [[key, serializedValue]];
        }),
      );
    }

    return input;
  };

  return visit(value);
};

module.exports = {
  sanitizeForJson,
};
