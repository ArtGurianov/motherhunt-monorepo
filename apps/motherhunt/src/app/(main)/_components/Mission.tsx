import { PageSection } from "@shared/ui/components/PageSection";
import { Quote } from "@shared/ui/components/Quote";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/ui/components/card";
import { getTranslations } from "next-intl/server";

export const Mission = async () => {
  const t = await getTranslations("HOME.MISSION");

  return (
    <PageSection className="flex flex-col grow justify-start items-center">
      <Card className="w-full max-w-lg pt-0 overflow-clip">
        <CardTitle className="bg-linear-to-tr from-accent-foreground to-accent-foreground/50 border-b-2 py-2">
          <CardHeader className="text-4xl font-bold text-center text-foreground/95">
            {`🛸 ${t("title")} ✨`}
          </CardHeader>
        </CardTitle>
        <CardContent>
          <ul className="flex flex-col justify-center items-center w-full px-2 gap-4">
            <li>
              <Quote className="text-xl font-medium py-1 mb-1">
                {t("quote-1")}
              </Quote>
              <p className="font-mono text-md px-2">
                {t("quote-1-description")}
              </p>
            </li>
            <li>
              <Quote className="text-xl font-medium py-1 mb-1">
                {t("quote-2")}
              </Quote>
              <p className="font-mono text-md px-2">
                {t("quote-2-description")}
              </p>
            </li>
            <li>
              <Quote className="text-xl font-medium py-1 mb-1">
                {t("quote-3")}
              </Quote>
              <p className="font-mono text-md px-2">
                {t("quote-3-description")}
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </PageSection>
  );
};
