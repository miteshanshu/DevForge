import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityFeed } from '@/components/profile/ActivityFeed';
import { apiClient } from '@/lib/api-client';

async function getProfile(username: string) {
  try {
    const data = await apiClient.get<{ user: unknown }>(`/users/${username}`, {
      next: { revalidate: 60 },
    });
    return data.user;
  } catch {
    return null;
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  // Format activities from projects and build logs
  const activities = [
    ...(profile.projects?.map((p: { id: string; title: string; createdAt: string; description: string }) => ({
      id: `proj-${p.id}`,
      type: 'PROJECT',
      title: `Created project: ${p.title}`,
      date: p.createdAt,
      description: p.description,
    })) || []),
    ...(profile.buildLogs?.map((b: { id: string; createdAt: string; content: string }) => ({
      id: `log-${b.id}`,
      type: 'BUILD_LOG',
      title: `Added a build log`,
      date: b.createdAt,
      description: b.content,
    })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                  {profile.name?.charAt(0) || profile.username.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-xl">{profile.name || profile.username}</CardTitle>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.bio && <p className="text-sm">{profile.bio}</p>}
              
              <div className="flex justify-between items-center text-sm border-t pt-4">
                <span className="font-medium">Contribution Score</span>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-bold">
                  {profile.score}
                </span>
              </div>
              
              {profile.location && (
                <div className="text-sm text-muted-foreground flex items-center">
                  📍 {profile.location}
                </div>
              )}
            </CardContent>
          </Card>

          {profile.skills && profile.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <span key={skill} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <ActivityFeed activities={activities} />
        </div>
        
      </div>
    </div>
  );
}
