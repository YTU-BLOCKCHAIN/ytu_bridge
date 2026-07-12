import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-text-faint text-sm">Yükleniyor…</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
