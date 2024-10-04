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
    <>
      {Object.entries(groupedJobs).map(([month, monthJobs]) => (
        <div key={month} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{month}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthJobs?.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>
                    {new Date(job.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{job.description}</TableCell>
                  <TableCell>${job.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(job)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
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
                      className="ml-2"
                    >
                      Delete
                    </Button>
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
    </>
  );
}
