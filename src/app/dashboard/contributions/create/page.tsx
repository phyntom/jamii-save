import { redirect } from "next/navigation";
import { getSession } from "@/server/authentication";
import { authClient } from "@/lib/auth-client";
import RecordContribution from "@/components/contributions/record-contribution";

export default async function CreateContributionPage() {
  const user = await getSession();
  if (!user) redirect('/sign-in');


  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Contribution</h1>
        <p className="text-muted-foreground">Contribute funds to your community or add a record of contribution</p>
      </div>

      <RecordContribution />
    </div>
  )
}