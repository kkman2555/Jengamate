
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientInfoCardProps {
  profile: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export function ClientInfoCard({ profile }: ClientInfoCardProps) {
  const renderDetail = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between items-start py-3 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium text-right break-words max-w-[60%]">{value}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Client Information</CardTitle>
      </CardHeader>
      <CardContent>
        {profile ? (
          <>
            {renderDetail("Name", profile.full_name || "N/A")}
            {renderDetail("Email", profile.email || "N/A")}
          </>
        ) : (
          <p className="text-muted-foreground">Client details not available.</p>
        )}
      </CardContent>
    </Card>
  );
}
