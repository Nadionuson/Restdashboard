'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);

  const [bio, setBio] = useState('');

  // Search & Invite state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [sendingRequestId, setSendingRequestId] = useState<number | null>(null);

  const handleAcceptRequest = async (userId: number) => {
  try {
    const res = await fetch('/api/friends/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId: userId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to accept request');
    }
    // Remove from incomingRequests and add to friends
    setIncomingRequests(prev => prev.filter(u => u.id !== userId));
    const acceptedUser = incomingRequests.find(u => u.id === userId);
    if (acceptedUser) {
      setFriends(prev => [...prev, acceptedUser]);
    }
    alert('Friend request accepted');
  } catch (err) {
    console.error(err);
    alert('Error accepting friend request');
  }
};

const handleDeclineRequest = async (userId: number) => {
  try {
    const res = await fetch('/api/friends/decline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId: userId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to decline request');
    }
    // Remove from incomingRequests
    setIncomingRequests(prev => prev.filter(u => u.id !== userId));
    alert('Friend request declined');
  } catch (err) {
    console.error(err);
    alert('Error declining friend request');
  }
};

const handleRemoveFriend = async (userId: number) => {
  try {
    const res = await fetch('/api/friends/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendUserId: userId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to remove friend');
    }
    // Remove from friends list
    setFriends(prev => prev.filter(u => u.id !== userId));
    alert('Friend removed');
  } catch (err) {
    console.error(err);
    alert('Error removing friend');
  }
};

const handleCancelRequest = async (userId: number) => {
  try {
    const res = await fetch('/api/friends/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toUserId: userId }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to cancel request');
    }
    // Remove from sentRequests
    setSentRequests(prev => prev.filter(u => u.id !== userId));
    alert('Friend request cancelled');
  } catch (err) {
    console.error(err);
    alert('Error cancelling friend request');
  }
};


  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update profile');
      }

      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Error saving profile');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed:', err);
      alert('Search failed');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSendRequest = async (userId: number) => {
    setSendingRequestId(userId);
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toUserId: userId }),
      });
      if (res.ok) {
        setSearchResults(prev => prev.filter(user => user.id !== userId));
        alert('Friend request sent');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send request');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send request');
    } finally {
      setSendingRequestId(null);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || '');
      setEmail(session.user.email || '');
      // TODO: Fetch friends, incomingRequests, sentRequests here
    }
  }, [session]);

  useEffect(() => {
    if (status !== 'loading') setLoading(false);
  }, [status]);

  useEffect(() => {
  if (!session?.user?.email) return;

  const fetchFriendsData = async () => {
    try {
      const res = await fetch('/api/friends/list');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load friends data');
      }
      const { friends, incomingRequests, sentRequests } = await res.json();
      setFriends(friends.map((f: any) => ({ id: f.id, name: f.username || f.name || '', email: f.email })));
      setIncomingRequests(incomingRequests.map((r: any) => ({ id: r.id, name: r.username || r.name || '', email: r.email })));
      setSentRequests(sentRequests.map((r: any) => ({ id: r.id, name: r.username || r.name || '', email: r.email })));
    } catch (err) {
      console.error(err);
      alert('Failed to load friends data');
    }
  };

  fetchFriendsData();
}, [session]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return <div className="text-center text-muted-foreground mt-10">You must be signed in to view this page.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Account Management</h1>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <h2 className="text-xl font-semibold">Profile Information</h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input value={email} disabled className="opacity-75 cursor-not-allowed" />
            </div>

            {/* Optional bio or avatar could be here */}

            {/* 
            <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground">
              Save Changes
            </Button>
            */}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="space-y-6">
          <h2 className="text-xl font-semibold">Friends</h2>

          {/* Search & Invite Section */}
          <div className="pt-6 space-y-2">
            <h3 className="text-md font-medium">Search and Invite Users</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Search users by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSearch} disabled={loadingSearch}>
                {loadingSearch ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 mt-2 max-h-64 overflow-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-2 border rounded bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendRequest(user.id)}
                      disabled={sendingRequestId === user.id}
                    >
                      {sendingRequestId === user.id ? 'Sending...' : 'Invite'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Friends List */}
          <div>
            <h3 className="text-md font-medium mb-2">Your Friends</h3>
            {friends.length > 0 ? (
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li key={friend.id} className="flex justify-between items-center bg-muted p-3 rounded-md">
                    <span>{friend.name}</span>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveFriend(friend.id)}>
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">You have no friends yet.</p>
            )}
          </div>

          {/* Incoming Requests */}
          <div>
            <h3 className="text-md font-medium mb-2">Incoming Requests</h3>
            {incomingRequests.length > 0 ? (
              <ul className="space-y-2">
                {incomingRequests.map((request) => (
                  <li key={request.id} className="flex justify-between items-center bg-muted p-3 rounded-md">
                    <span>{request.name}</span>
                    <div className="space-x-2">
                      <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeclineRequest(request.id)}>
                        Decline
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No incoming requests.</p>
            )}
          </div>

          {/* Sent Requests */}
          <div>
            <h3 className="text-md font-medium mb-2">Sent Requests</h3>
            {sentRequests.length > 0 ? (
              <ul className="space-y-2">
                {sentRequests.map((request) => (
                  <li key={request.id} className="flex justify-between items-center bg-muted p-3 rounded-md">
                    <span>{request.name}</span>
                    <Button variant="outline" size="sm" onClick={() => handleCancelRequest(request.id)}>
                      Cancel
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No pending requests.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">Security settings coming soon...</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
