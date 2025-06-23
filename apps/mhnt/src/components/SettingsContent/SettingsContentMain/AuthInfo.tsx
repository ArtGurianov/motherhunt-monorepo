import { InfoCard } from "@/components/InfoCard/InfoCard";
import { auth } from "@/lib/auth/auth";
import { Button } from "@shared/ui/components/button";
import { InlineData } from "@shared/ui/components/InlineData";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";

export const AuthInfo = async () => {
  const headers = await nextHeaders();
  const session = await auth.api.getSession({ headers });
  if (!session) redirect("/signin");

  return (
    <InfoCard title="account">
      <InlineData label="Currently logged in as:">
        {session.user.role}
      </InlineData>
      <div className="w-full flex gap-4 items-center px-1">
        <span className="text-sm font-bold text-end">{"Switch to:"}</span>
        <Button size="sm" variant="secondary">
          {"Scouter"}
        </Button>
        <span className="text-sm font-bold">{"or"}</span>
        <Button size="sm" variant="secondary">
          {"Agency"}
        </Button>
      </div>
    </InfoCard>
  );
};
