import { CreateServiceForm } from "@/components/create-service-form";

export default function CreateServicePage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Service</h1>
      <CreateServiceForm />
    </div>
  );
}
