import { canViewHeadBooker } from "@/lib/auth/permissions/checkers";
import { ManageBookers } from "./_widgets/ManageBookers";
import { StatusCard, StatusCardTypes } from "@shared/ui/components/StatusCard";

export default async function AgencyManagePage() {
  const canAccess = await canViewHeadBooker();
  if (!canAccess)
    return <StatusCard type={StatusCardTypes.ERROR} title="Access Denied" />;

  return (
    <>
      <ManageBookers />
    </>
  );
}
