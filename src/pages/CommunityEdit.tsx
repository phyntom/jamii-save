import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, useOutletContext, useParams } from "react-router";
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
} from "@/components/ui/form";
import { FormInput } from "@/components/FormInput";
import { CommunityPreview } from "@/components/CommunityPreview";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FormSelect } from "@/components/FormSelect";
import { COUNTRY_OPTIONS } from "@/constants/countries";
import { FileUpload } from "@/components/FileUpload";
import { Id } from "convex/_generated/dataModel";
import { OutletContext } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  description: z.string().max(280).optional(),
  country: z.string().min(1, "Country is required").max(80),
  logo: z
    .instanceof(File)
    .refine((f) => f.size < 3 * 1024 * 1024, "Max 3MB")
    .refine((f) => f.type.startsWith("image/"), "Must be an image")
    .optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function CommunityEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const uploadFile = useMutation(api.communities.generateUploadUrl);
  const updateCommunity = useMutation(api.communities.update);
  const { community } = useOutletContext<OutletContext>();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      country: community?.country ?? "",
      logo: undefined,
    },
  });

  const { watch, formState } = form;
  const nameValue = watch("name");
  const descValue = watch("description") ?? "";
  const isActive = watch("isActive");

  useEffect(() => {
    if (community) {
      form.reset({
        name: community.name,
        description: community.description ?? "",
        country: community.country ?? "",
        isActive: community.isActive,
      });
    }
  }, [community]);

  async function onSubmit(data: FormValues) {
    if (!community) return;
    let storageId: Id<"_storage"> | undefined;
    try {
      if (data.logo) {
        const uploadUrl = await uploadFile();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": data.logo.type },
          body: data.logo,
        });
        const { storageId: id } = (await res.json()) as {
          storageId: Id<"_storage">;
        };
        storageId = id;
      }
      await updateCommunity({
        id: community._id,
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        logo: storageId ?? undefined,
        country: data.country,
      });
      toast.success("Community updated.");
      navigate(`/communities/${slug}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (community === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (community === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Community not found.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl w-2xl lg:w-4xl mx-auto px-6 py-10 my-4">
      <button
        onClick={() => navigate(`/communities/${slug}`)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to community
      </button>

      <h1 className="text-2xl font-medium text-foreground mb-1">
        Edit community
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Update your community details.
      </p>

      {/* Slug display — read only, not part of the form */}
      <div className="bg-muted border rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">slug</span>
        <span className="text-sm font-mono text-foreground">
          @{community.slug}
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          cannot be changed
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="border border-border/50 rounded-xl p-6 space-y-5">
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
              variant="textarea"
              name="description"
              label="Description"
              placeHolder="What is this community about?"
              maxLength={280}
              showCharCount
            />
            <FormSelect
              control={form.control}
              name="country"
              label="Country"
              placeholder="Select a country"
              options={COUNTRY_OPTIONS}
              className="w-full"
            />
            <FileUpload name="logo" label="Logo" accept="image/*" />
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6">
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
            slug={community.slug}
            description={descValue}
            isActive={isActive}
            logo={community.logo}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/communities/${slug}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
