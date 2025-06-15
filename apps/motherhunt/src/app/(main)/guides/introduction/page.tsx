import MdxLayout from "@/components/MdxLayout/MdxLayout";
import { getAppLocale } from "@/lib/utils";
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
    console.log(locale, error);
    notFound();
  }
}
