'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FriendsTab from './_tabs/FriendsTab';
import SecurityTab from './_tabs/SecurityTab';
import SettingsTab from './_tabs/Settingstab';
import Link from 'next/link'; // Import Link for navigation
import { Button } from '@/components/ui/button'; // Import Button component

export default function AccountPage() {
  const [tab, setTab] = useState('friends');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>

      {/* Go back to Dashboard button */}
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4">
          Go back to Dashboard
        </Button>
      </Link>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendsTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
