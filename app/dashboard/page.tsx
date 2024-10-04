"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { JobTable } from "@/components/job-table";

export default function DashboardPage() {
  const jobs = useQuery(api.jobs.list);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {jobs && <JobTable jobs={jobs} />}
    </div>
  );
}
