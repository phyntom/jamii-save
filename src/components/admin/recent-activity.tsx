import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  type: string;
  id: string;
  amount: string;
  created_at: string;
  user_name: string;
  group_name: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={activity.type === 'contribution' ? 'default' : 'secondary'}>
                    {activity.type}
                  </Badge>
                  <span className="text-sm font-medium">{activity.user_name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.group_name} •{' '}
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="text-sm font-semibold">
                ${Number.parseFloat(activity.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
