export const createTurnstileHeaders = (headers: Headers) => {
  return {
    userIp: headers.get("x-forwarded-for"),
    turnstileToken:
      process.env.NODE_ENV === "production"
        ? headers.get("cf-turnstile-response")
        : "1x00000000000000000000AA",
  };
};
