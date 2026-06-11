import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  id: string;
  type: 'PROJECT' | 'POST' | 'BUILD_LOG';
  title: string;
  date: string;
  description?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No recent activity to show.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader className="py-4">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{activity.title}</span>
              <span className="text-xs text-muted-foreground font-normal">
                {new Date(activity.date).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          {activity.description && (
            <CardContent className="py-4 pt-0 text-sm text-muted-foreground">
              {activity.description}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
