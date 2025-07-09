import { canViewHeadBooker } from "@/lib/auth/permissions/checkers/server";
import { ManageBookers } from "./_widgets/ManageBookers";

export default async function AgencyManagePage() {
  const canAccess = await canViewHeadBooker();
  if (!canAccess) return "ERROR CARD ACCESS DENIED";

  return (
    <>
      <ManageBookers />
    </>
  );
}
