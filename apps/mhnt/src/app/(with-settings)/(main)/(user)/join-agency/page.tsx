import { Suspense } from "react";
import { AcceptInvitationWidget } from "./_widgets/AcceptInvitationWidget";

export default function JoinAgencyPage() {
  return (
    <Suspense>
      <AcceptInvitationWidget />
    </Suspense>
  );
}
