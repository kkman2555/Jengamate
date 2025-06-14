
import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { AccountInfo } from '@/components/profile/AccountInfo';

const Profile = () => {
  const { user, loading: authLoading, updateUserMetadata } = useAuth();
  const { profile, loading: profileLoading, refetchProfile } = useProfile();

  useEffect(() => {
    if (!profile || !user || !user.user_metadata) return;

    const metadata = {
      full_name: user.user_metadata.full_name || '',
      company_name: user.user_metadata.company_name || ''
    };

    const profileData = {
      full_name: profile.full_name || '',
      company_name: profile.company_name || ''
    };

    const needsUpdate = metadata.full_name !== profileData.full_name ||
                        metadata.company_name !== profileData.company_name;

    if (needsUpdate) {
      updateUserMetadata({
        full_name: profile.full_name,
        company_name: profile.company_name
      });
    }
  }, [profile, user, updateUserMetadata]);

  // Show loading if either auth or profile is loading
  if (authLoading || profileLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading profile...</span>
        </div>
      </AppLayout>
    );
  }

  // Show error if no user is authenticated
  if (!user) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </AppLayout>
    );
  }

  // Show error if profile failed to load
  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Unable to load profile data. Please try refreshing the page.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <ProfileForm
            initialData={{
              full_name: profile.full_name || '',
              company_name: profile.company_name || '',
              email: profile.email || ''
            }}
            userId={user.id}
            onUpdate={refetchProfile}
          />

          <AccountInfo profile={profile} userId={user.id} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
