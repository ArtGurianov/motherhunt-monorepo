import MdxLayout from "@/components/MdxLayout/MdxLayout";
import { getAppLocale } from "@shared/ui/lib/utils";
import { notFound } from "next/navigation";

export default async function IntroductionPage() {
  const locale = getAppLocale();

  try {
    const Content = (await import(`./${locale}.mdx`)).default;
    return (
      <MdxLayout>
        <Content />
      </MdxLayout>
    );
  } catch (error) {
    notFound();
  }
}
