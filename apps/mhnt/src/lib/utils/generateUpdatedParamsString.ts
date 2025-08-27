export const generateUpdatedParamsString = (params: URLSearchParams) =>
  `${params.size ? "?" + params.toString() : ""}`;
