import Link from 'next/link';
import { User, Grid3X3 } from 'lucide-react';
import LogoutButton from '@/components/ui/logoutButton';

export function DashboardHeader({ username }: { username?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Restaurant Hub</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <Link href="/account" className="text-sm text-muted-foreground hover:underline">
                {username}
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
