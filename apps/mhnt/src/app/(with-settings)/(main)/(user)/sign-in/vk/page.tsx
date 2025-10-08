import { Suspense } from "react";
import { SignInVkPageContent } from "./_widgets/SignInVkPageContent";

export default function SignInVkPage() {
  return (
    <Suspense>
      <SignInVkPageContent />
    </Suspense>
  );
}
