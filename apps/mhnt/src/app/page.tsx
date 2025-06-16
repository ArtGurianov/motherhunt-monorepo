import { LoginForm } from "@/components/LoginForm/LoginForm";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 grow justify-start items-center py-12">
      <LoginForm />
    </div>
  );
}
