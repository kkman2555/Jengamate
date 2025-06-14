
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  created_at: string;
  updated_at: string;
}

interface AccountInfoProps {
  profile: UserProfile | null;
  userId: string;
}

export const AccountInfo = ({ profile, userId }: AccountInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          View your account details and membership information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-sm font-medium">User ID</span>
          <span className="text-sm text-muted-foreground font-mono">{userId}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-sm font-medium">Account Created</span>
          <span className="text-sm text-muted-foreground">
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium">Last Updated</span>
          <span className="text-sm text-muted-foreground">
            {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
