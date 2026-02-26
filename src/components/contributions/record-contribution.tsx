'use client';

import { authClient } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecordContributionForm } from './record-contribution-form';

export default function RecordContribution() {
  const { data: activeCommunity } = authClient.useActiveOrganization();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record new contribution</CardTitle>
        <CardDescription>Enter the information for your contribution</CardDescription>
      </CardHeader>
      <CardContent>
        {/* contribution form */}
        {activeCommunity ? (
          <RecordContributionForm
            groupId={activeCommunity.id}
            contributionAmount={parseFloat(activeCommunity.targetAmount)}
            currency={activeCommunity.currency}
          />
        ) : (
          <div>Loading</div>
        )}
      </CardContent>
    </Card>
  );
}
