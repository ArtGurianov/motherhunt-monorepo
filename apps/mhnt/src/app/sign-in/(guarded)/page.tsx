import { SignInForm } from "@/components/Forms";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center w-full h-[calc(var(--height-content)+var(--height-nav))] px-2">
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  );
}
