import axios from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "something went wrong",
): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string") return message;
  }
  return fallback;
};
