'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/stores/auth.store';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  name: z.string().max(50).optional(),
  bio: z.string().max(255).optional(),
  location: z.string().max(100).optional(),
  skills: z.string().optional(), // We'll parse this to an array
  website: z.string().url().or(z.literal('')).optional(),
  github: z.string().url().or(z.literal('')).optional(),
  twitter: z.string().url().or(z.literal('')).optional(),
  linkedin: z.string().url().or(z.literal('')).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
      location: '',
      skills: '',
      website: '',
      github: '',
      twitter: '',
      linkedin: '',
    },
  });

  useEffect(() => {
    // Fetch latest profile data to populate form
    const fetchProfile = async () => {
      if (!user?.username) return;
      try {
        const data = await apiClient.get<{ user: { name?: string; bio?: string; location?: string; skills?: string[]; socialLinks?: Record<string, string> } }>(`/users/${user.username}`);
        if (data?.user) {
          reset({
            name: data.user.name || '',
            bio: data.user.bio || '',
            location: data.user.location || '',
            skills: data.user.skills ? data.user.skills.join(', ') : '',
            website: data.user.socialLinks?.website || '',
            github: data.user.socialLinks?.github || '',
            twitter: data.user.socialLinks?.twitter || '',
            linkedin: data.user.socialLinks?.linkedin || '',
          });
        }
      } catch {
        toast.error('Failed to load profile data');
      }
    };
    fetchProfile();
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const skillsArray = data.skills
        ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: data.name,
        bio: data.bio,
        location: data.location,
        skills: skillsArray,
        socialLinks: {
          website: data.website,
          github: data.github,
          twitter: data.twitter,
          linkedin: data.linkedin,
        },
      };

      const result = await apiClient.request<{ user: Partial<User> & Pick<User, 'username'> }>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (result.user && user) {
        setUser({
          id: result.user.id ?? user.id,
          email: result.user.email ?? user.email,
          username: result.user.username,
          name: result.user.name ?? user.name,
          avatar: result.user.avatar ?? user.avatar,
        });
        toast.success('Profile updated successfully');
        router.push(`/u/${result.user.username}`);
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null; // Or a loading spinner / redirect

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and social links.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Info</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" {...register('name')} placeholder="John Doe" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" {...register('bio')} placeholder="Full-stack developer..." />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} placeholder="San Francisco, CA" />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input id="skills" {...register('skills')} placeholder="React, Node.js, TypeScript" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <Input id="website" {...register('website')} placeholder="https://example.com" />
                {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile URL</Label>
                <Input id="github" {...register('github')} placeholder="https://github.com/username" />
                {errors.github && <p className="text-sm text-destructive">{errors.github.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Profile URL</Label>
                <Input id="twitter" {...register('twitter')} placeholder="https://twitter.com/username" />
                {errors.twitter && <p className="text-sm text-destructive">{errors.twitter.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
