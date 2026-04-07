import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/FormInput";
import { CommunityPreview } from "@/components/CommunityPreview";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  country: z.string().min(1, "Country is required").max(80),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(40)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Lowercase letters, numbers, and hyphens only",
    ),
  description: z.string().max(280).optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CommunityForm() {
  const navigate = useNavigate();
  const createCommunity = useMutation(api.communities.createCommunity);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      country: "",
      slug: "",
      description: "",
      isActive: true,
    },
  });

  const { watch, setValue, formState } = form;
  const nameValue = watch("name");
  const slugValue = watch("slug");
  const descValue = watch("description") ?? "";
  const isActive = watch("isActive");
  const slugTouched = formState.dirtyFields.slug;

  useEffect(() => {
    if (!slugTouched && nameValue) {
      setValue("slug", toSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, slugTouched]);

  async function onSubmit(data: FormValues) {
    try {
      await createCommunity(data);
      toast.success("Community created!");
      navigate(`/communities/${data.slug}`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("slug")) {
          form.setError("slug", { message: "This slug is already taken." });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate("/overview")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to overview
      </button>

      <h1 className="text-2xl font-medium text-foreground mb-1">
        Create a community
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Set up a space for your members to connect.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-background border border-border/50 rounded-xl p-6 space-y-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Basic info
            </p>
            <FormInput
              control={form.control}
              name="name"
              label="Community name"
              placeHolder="e.g. Dev Enthusiasts"
            />

            <FormInput
              control={form.control}
              name="country"
              label="Country"
              placeHolder="e.g. United States"
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL slug</FormLabel>
                  <FormControl>
                    <div className="flex items-center border border-input rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                      <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input font-mono">
                        @
                      </span>
                      <input
                        {...field}
                        className="flex-1 px-3 py-2 text-sm font-mono bg-background outline-none"
                        placeholder="dev-enthusiasts"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, ""),
                          )
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Used in URLs and mentions.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormInput
              control={form.control}
              variant="textarea"
              name="description"
              label="Description"
              placeHolder="What is this community about?"
              maxLength={280}
              showCharCount
            />
          </div>

          <div className="bg-background border border-border/50 rounded-xl p-6">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Settings
            </p>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4">
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Active
                    </FormLabel>
                    <FormDescription>
                      Members can access and join this community
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <CommunityPreview
            name={nameValue}
            slug={slugValue}
            description={descValue}
            isActive={isActive}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/overview")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Creating..." : "Create community"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
