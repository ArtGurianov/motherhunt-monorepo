import { SignOutBtn } from "@/components/ActionButtons/SignOutBtn";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";
import { AuthInfo } from "@/components/SettingsContent/SettingsContentMain/AuthInfo";
import { EmailInfo } from "@/components/SettingsContent/SettingsContentMain/EmailInfo";

export default function AgencySettingsPage() {
  return (
    <div className="flex flex-col gap-4 w-full h-full justify-center items-center">
      <AuthInfo />
      <EmailInfo />
      <div className="w-full flex justify-between items-center">
        <LangSwitcher />
        <SignOutBtn />
      </div>
    </div>
  );
}
