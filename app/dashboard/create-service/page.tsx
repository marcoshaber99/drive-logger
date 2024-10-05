import { CreateServiceForm } from "@/components/create-service-form";

export default function CreateServicePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Service</h1>
      <div className="max-w-3xl">
        <CreateServiceForm />
      </div>
    </div>
  );
}
