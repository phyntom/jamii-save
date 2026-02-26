import { redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { CreateCommunityForm } from '@/components/community/create-community-form';

export default async function CreateGroupPage() {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create a Community</h1>
        <p className="text-muted-foreground">Set up a new savings group for your community</p>
      </div>
      <CreateCommunityForm />
    </div>
  );
}
