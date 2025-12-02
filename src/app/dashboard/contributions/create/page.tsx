import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { RecordContributionForm } from "@/components/contributions/record-contribution-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CreateContributionPage() {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Contribution</h1>
        <p className="text-muted-foreground">Contribute funds to your community or add a record of contribution</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Record new contribution</CardTitle>
          <CardDescription>Enter the information for your contribution</CardDescription>
        </CardHeader>
        <CardContent>
          {/* contribution form */}
          <RecordContributionForm />
        </CardContent>
      </Card>
    </div>
  )
}