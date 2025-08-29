import { AdminSignInForm } from "@/components/Forms";

export default function AdminSignInPage() {
  return (
    <div className="flex justify-center items-center w-full h-[calc(var(--height-content)+var(--height-nav))] px-2">
      <AdminSignInForm />
    </div>
  );
}
