'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  return (
    <Button
    variant="outline"
    className="text-sm text-muted-foreground border-none hover:text-foreground px-2 py-1"
    onClick={() => signOut()}
  >
    Logout
  </Button>
  
  );
}
