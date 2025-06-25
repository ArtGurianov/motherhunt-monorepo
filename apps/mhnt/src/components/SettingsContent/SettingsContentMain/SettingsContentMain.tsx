import { SignOutBtn } from "@/components/ActionButtons/SignOutBtn";
import { AuthInfo } from "./AuthInfo";
import { LangSwitcher } from "@/components/LangSwitcher/LangSwitcher";

export const SettingsContentMain = () => {
  return (
    <div className="flex flex-col gap-4 w-full justify-start items-center">
      <AuthInfo />
      <div className="w-full flex justify-between items-center">
        <LangSwitcher />
        <SignOutBtn />
      </div>
    </div>
  );
};
