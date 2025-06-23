import { SignOutBtn } from "@/components/ActionButtons/SignOutBtn";
import { AuthInfo } from "./AuthInfo";

export const SettingsContentMain = () => {
  return (
    <div className="flex flex-col gap-2 w-full justify-start items-center">
      <AuthInfo />
      <SignOutBtn />
    </div>
  );
};
