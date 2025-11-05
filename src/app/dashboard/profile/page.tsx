import { redirect } from 'next/navigation';
import { getSession } from '@/server/authentication';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sql } from '@/lib/db';

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect('/sign-in');

  const userDetails = await sql`
    SELECT *
    FROM jamii.user
    WHERE id = ${user.id}
  `;

  const userInfo = userDetails[0];

  const subscription = await sql`
    SELECT us.*, p.name as plan_name
    FROM jamii.user_subscriptions us
    JOIN jamii.plans p ON us.plan_id = p.id
    WHERE us.user_id = ${user.id} AND us.status = 'active'
    ORDER BY us.created_at DESC
    LIMIT 1
  `;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={userInfo.name} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={userInfo.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              defaultValue={userInfo.phone_number || ''}
              placeholder="Not set"
              disabled
            />
          </div>
          <Button disabled>Update Profile (Coming Soon)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription.length > 0 ? (
            <>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{subscription[0].plan_name} Plan</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {subscription[0].billing_cycle} billing
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium capitalize">{subscription[0].status}</p>
                  <p className="text-sm text-muted-foreground">
                    Renews {new Date(subscription[0].current_period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" disabled>
                Upgrade Plan (Coming Soon)
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">No active subscription</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
