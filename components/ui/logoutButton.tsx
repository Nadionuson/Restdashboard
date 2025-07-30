'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
      onClick={() => signOut()}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
