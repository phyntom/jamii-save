import { redirect } from 'next/navigation';
import { getSession } from '@/app/actions/auth';
import { CreateCommunityForm } from '@/components/groups/create-community-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CreateGroupPage() {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create a Community</h1>
        <p className="text-muted-foreground">Set up a new savings group for your community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community Details</CardTitle>
          <CardDescription>Enter the information for community</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCommunityForm />
        </CardContent>
      </Card>
    </div>
  );
}
