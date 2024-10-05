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
import { Download, Edit, Trash2 } from "lucide-react";
import { CSVLink } from "react-csv";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [jobToDelete, setJobToDelete] = useState<Id<"jobs"> | null>(null);

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

  const handleDeleteConfirm = async () => {
    if (jobToDelete) {
      await deleteJob({ id: jobToDelete });
      setJobToDelete(null);
    }
  };

  const prepareCSVData = (monthJobs: Job[]) => {
    const csvData = [
      ["Date", "Description", "Price"],
      ...monthJobs.map((job) => [
        new Date(job.date).toLocaleDateString(),
        job.description,
        job.price.toFixed(2),
      ]),
      [
        "",
        "Total",
        monthJobs.reduce((sum, job) => sum + job.price, 0).toFixed(2),
      ],
    ];
    return csvData;
  };

  return (
    <div className="space-y-8">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setJobToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        {Object.entries(groupedJobs).map(([month, monthJobs]) => (
          <div
            key={month}
            className="bg-card rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 bg-muted">
              <h2 className="text-xl font-semibold text-foreground">{month}</h2>
              <CSVLink
                data={prepareCSVData(monthJobs)}
                filename={`jobs-${month.replace(" ", "-")}.csv`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </CSVLink>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/5">Date</TableHead>
                  <TableHead className="w-2/5">Description</TableHead>
                  <TableHead className="w-1/5">Price</TableHead>
                  <TableHead className="w-1/5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthJobs?.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell className="font-medium">
                      {new Date(job.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {job.description}
                    </TableCell>
                    <TableCell>${job.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(job)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
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
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setJobToDelete(job._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
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
      </AlertDialog>
    </div>
  );
}
