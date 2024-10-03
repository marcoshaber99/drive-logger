import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (userId) {
    redirect("/");
  }
  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
}
