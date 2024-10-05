"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface Job extends Doc<"jobs"> {
  date: string;
  description: string;
  price: number;
}

interface JobTableProps {
  jobs: Job[];
}

export function JobTable({ jobs }: JobTableProps) {
  const updateJob = useMutation(api.jobs.update);
  const deleteJob = useMutation(api.jobs.remove);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (jobs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">No jobs found.</p>
        <p className="text-sm text-gray-400 mt-2">
          Create a new job to get started.
        </p>
      </div>
    );
  }

  const groupedJobs = jobs.reduce(
    (acc, job) => {
      const month = new Date(job.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(job);
      return acc;
    },
    {} as Record<string, Job[]>
  );

  const handleEdit = (job: Job) => {
    setEditingJob({ ...job });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (editingJob) {
      await updateJob({
        id: editingJob._id,
        date: editingJob.date,
        description: editingJob.description,
        price: editingJob.price,
      });
      setEditingJob(null);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: Id<"jobs">) => {
    if (confirm("Are you sure you want to delete this job?")) {
      await deleteJob({ id });
    }
  };

  return (
    <div className="overflow-x-auto animate-fade-in">
      {Object.entries(groupedJobs).map(([month, monthJobs]) => (
        <div key={month} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{month}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Date</TableHead>
                <TableHead className="w-2/5">Description</TableHead>
                <TableHead className="w-1/5">Price</TableHead>
                <TableHead className="w-1/5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthJobs?.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(job.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {job.description}
                  </TableCell>
                  <TableCell>${job.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(job)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Job</DialogTitle>
                          </DialogHeader>
                          {editingJob && (
                            <div className="space-y-4">
                              <Input
                                type="date"
                                value={editingJob.date}
                                onChange={(e) =>
                                  setEditingJob({
                                    ...editingJob,
                                    date: e.target.value,
                                  })
                                }
                              />
                              <Textarea
                                value={editingJob.description}
                                onChange={(e) =>
                                  setEditingJob({
                                    ...editingJob,
                                    description: e.target.value,
                                  })
                                }
                              />
                              <Input
                                type="number"
                                value={editingJob.price}
                                onChange={(e) =>
                                  setEditingJob({
                                    ...editingJob,
                                    price: parseFloat(e.target.value),
                                  })
                                }
                              />
                              <Button onClick={handleUpdate}>Update</Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(job._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="font-bold">
                  Total
                </TableCell>
                <TableCell className="font-bold">
                  $
                  {monthJobs
                    ?.reduce((sum, job) => sum + job.price, 0)
                    .toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
