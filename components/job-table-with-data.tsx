"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { JobTable } from "@/components/job-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobTableWithData() {
  const jobs = useQuery(api.jobs.list);

  if (jobs === undefined) {
    return <JobTableSkeleton />;
  }

  return <JobTable jobs={jobs} />;
}

function JobTableSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-1">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
