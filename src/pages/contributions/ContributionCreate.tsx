import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { FileUpload } from "@/components/FileUpload";
import { mockCommunities } from "@/lib/mock-data";

const contributionSchema = z.object({
  communityId: z.string().min(1, "Please select a community"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  reference: z.string().min(1, "Reference number is required"),
  notes: z.string().optional(),
  proof: z.any().optional(),
});

type ContributionForm = z.infer<typeof contributionSchema>;

const paymentMethods = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "airtel_money", label: "Airtel Money" },
];

export default function ContributionCreate() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      communityId: "",
      amount: undefined,
      paymentMethod: "",
      reference: "",
      notes: "",
    },
  });

  async function handleSubmit(_data: ContributionForm) {
    setIsLoading(true);
    // Faked — will be wired to backend later
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success("Contribution recorded successfully");
    navigate("/contributions");
  }

  const communityOptions = mockCommunities.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <div>
        <Link
          to="/contributions"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to contributions
        </Link>
        <h1 className="text-2xl font-medium text-foreground">
          New Contribution
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Record a contribution to your community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribution Details</CardTitle>
          <CardDescription>
            Fill in the details of your contribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              <FormSelect
                control={form.control}
                name="communityId"
                label="Community"
                placeHolder="Select a community"
                options={communityOptions}
              />

              <FormInput
                control={form.control}
                name="amount"
                label="Amount (KES)"
                type="number"
                placeHolder="5000"
              />

              <FormSelect
                control={form.control}
                name="paymentMethod"
                label="Payment Method"
                placeHolder="Select payment method"
                options={paymentMethods}
              />

              <FormInput
                control={form.control}
                name="reference"
                label="Reference Number"
                placeHolder="e.g. MPE-2025-001"
              />

              <FormInput
                control={form.control}
                name="notes"
                label="Notes (optional)"
                variant="textarea"
                placeHolder="Any additional details..."
                rows={3}
              />

              <FileUpload
                name="proof"
                label="Proof of Payment (optional)"
                accept="image/*,.pdf"
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Record Contribution"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/contributions")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
