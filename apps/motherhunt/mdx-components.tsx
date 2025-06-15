import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    MdxImage: (props) => (
      <Image
        sizes="100vw"
        className="w-full h-auto"
        {...(props as ImageProps)}
      />
    ),
    ...components,
  };
}
