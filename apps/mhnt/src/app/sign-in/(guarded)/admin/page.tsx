import { AdminSignInForm } from "@/components/Forms";
import { Suspense } from "react";

export default function AdminSignInPage() {
  return (
    <div className="flex justify-center items-center w-full h-[calc(var(--height-content)+var(--height-nav))] px-2">
      <Suspense>
        <AdminSignInForm />
      </Suspense>
    </div>
  );
}
