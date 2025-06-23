import { SignOutBtn } from "@/components/ActionButtons/SignOutBtn";
import { AuthInfo } from "./AuthInfo";

export const SettingsContentMain = () => {
  return (
    <div className="flex flex-col gap-4 w-full justify-start items-center">
      <AuthInfo />
      <div className="w-full">
        <SignOutBtn />
      </div>
    </div>
  );
};
