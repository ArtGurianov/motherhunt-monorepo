export const transformStringToSlug = (value: string): string =>
  value
    .trim()
    .replace(/[^a-zA-Z0-9 ]+/g, "")
    .replace(/([^ A-Z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/ +/g, "-")
    .replace(/^-+|-+$/g, "");
