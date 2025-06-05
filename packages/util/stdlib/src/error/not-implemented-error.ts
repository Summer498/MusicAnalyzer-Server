export interface NotImplementedError extends Error {}

export const createNotImplementedError = (
  message = "Not Implemented.",
): NotImplementedError => {
  const err = new Error(message);
  err.name = "NotImplementedError";
  return err as NotImplementedError;
};
