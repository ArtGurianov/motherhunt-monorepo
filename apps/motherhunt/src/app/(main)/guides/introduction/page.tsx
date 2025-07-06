import MdxLayout from "@/components/MdxLayout/MdxLayout";
import { getAppLocale } from "@shared/ui/lib/utils";
import { notFound } from "next/navigation";
import { AppClientError } from "@shared/ui/lib/utils/appClientError";

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
    if (error instanceof AppClientError) {
      throw error;
    }
    notFound();
  }
}
