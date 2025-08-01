export type { ValueOf } from "./ValueOf.ts";
export type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;
