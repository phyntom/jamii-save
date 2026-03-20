import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, useParams } from "react-router";
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

const schema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  description: z.string().max(280).optional(),
  country: z.string().min(1, "Country is required").max(80),
  isActive: z.boolean(),

});

type FormValues = z.infer<typeof schema>;

export default function CommunityEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const community = useQuery(
    api.communities.getBySlug,
    slug ? { slug } : "skip",
  );

  console.log("community", community);

  const updateCommunity = useMutation(api.communities.update);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", isActive: true },
  });

  const { watch, formState } = form;
  const nameValue = watch("name");
  const descValue = watch("description") ?? "";
  const isActive = watch("isActive");


function handleUploadLogo(file : File){

  const uploadUrl = useMutation(api.communities.uploadFile);

}  


  useEffect(() => {
    if (community) {
      form.reset({
        name: community.name,
        description: community.description ?? "",
        isActive: community.isActive,
      });
    }
  }, [community]);

  async function onSubmit(data: FormValues) {
    if (!community) return;
    try {
      await updateCommunity({ id: community._id, ...data });
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
    <div className="max-w-2xl mx-auto px-6 py-10">
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
      <div className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
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
            />
            <FormInput
              control={form.control}
              variant="file"
              name="logo"
              label="Logo"
              accept="image/*"
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
            slug={community.slug}
            description={descValue}
            isActive={isActive}
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
