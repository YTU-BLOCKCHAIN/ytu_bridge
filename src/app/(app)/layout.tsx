import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

// (app) route group layout — AppShell + kullanıcı bilgisi.
// Auth gate middleware zaten giriş yapmamışı /login'e atar.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const name = email.split("@")[0].replace(/[._]/g, " ");

  return <AppShell userEmail={email} userName={name}>{children}</AppShell>;
}
