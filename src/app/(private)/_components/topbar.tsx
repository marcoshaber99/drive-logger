"use client";

import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export function Topbar() {
  const { user } = useUser();

  return (
    <div className="h-16 border-b bg-background flex items-center justify-end px-4 lg:px-6">
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2 hidden sm:inline-block">
          {user?.firstName || "User"}
        </span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
