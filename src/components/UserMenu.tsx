
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { User, LogOut, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3 bg-blue-500 bg-opacity-50 rounded-lg px-3 py-2">
      <User className="h-6 w-6" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user.email}</span>
      </div>
      {isAdmin && (
        <Button
          onClick={handleAdminClick}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-blue-600 h-8 w-8"
          title="Admin Dashboard"
        >
          <Shield className="h-4 w-4" />
        </Button>
      )}
      <Button
        onClick={handleSignOut}
        variant="ghost"
        size="icon"
        className="text-white hover:bg-blue-600 h-8 w-8"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserMenu;
