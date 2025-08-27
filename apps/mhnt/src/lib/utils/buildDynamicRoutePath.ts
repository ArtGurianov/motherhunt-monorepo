import { ExtractPathParams } from "./types";

export function buildDynamicRoutePath<TPath extends string>(
  path: TPath,
  params: { [K in ExtractPathParams<TPath>]: string }
): string {
  let result: string = path;

  for (const key in params) {
    result = result.replace(
      new RegExp(`\\[${key}\\]`, "g"),
      params[key as ExtractPathParams<TPath>]
    );
  }

  return result;
}
