import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to DriveLogger
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <SignInButton>Sign in</SignInButton>
          </Button>
          <Button asChild variant="outline" size="lg">
            <SignUpButton>Sign up</SignUpButton>
          </Button>
        </div>
      </div>
    </main>
  );
}
