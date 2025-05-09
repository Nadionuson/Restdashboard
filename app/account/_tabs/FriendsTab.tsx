'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type User = { id: number; email: string; username?: string };

export default function FriendsTab() {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [noUserFound, setNoUserFound] = useState(false);

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  async function handleSendInvite() {
    const res = await fetch('/api/friends/invite', {
      method: 'POST',
      body: JSON.stringify({ email: search }), // Use search for the email
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert('Invitation sent!');
      setSearch(''); // Clear search
      setSearchResult(null); // Reset search result
    } else {
      const errorData = await res.json();
      alert(errorData.error || 'Something went wrong');
    }
  }

  async function fetchFriends() {
    const res = await fetch('/api/friends');
    if (res.ok) {
      const data = await res.json();
      setFriends(data);
    }
  }

  async function fetchRequests() {
    const res = await fetch('/api/friends/requests');
    if (res.ok) {
      const data = await res.json();
      setIncomingRequests(data.incoming);
      setSentRequests(data.sent);
    }
  }

  async function handleSearch() {
    const res = await fetch(`/api/friends/search?query=${encodeURIComponent(search)}`);
    if (res.ok) {
      const data = await res.json();
      const user = data.user || null;
      setSearchResult(user);
      setNoUserFound(!user);
    }
  }

  async function sendRequest(id: number) {
    await fetch('/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({ userId: id }),
    });
    setSearch('');
    setSearchResult(null);
    setNoUserFound(false);
    fetchRequests();
  }

  async function acceptRequest(id: number) {
    await fetch('/api/friends/accept', {
      method: 'POST',
      body: JSON.stringify({ userId: id }),
    });
    fetchFriends();
    fetchRequests();
  }

  async function declineRequest(id: number) {
    await fetch('/api/friends/decline', {
      method: 'POST',
      body: JSON.stringify({ userId: id }),
    });
    fetchRequests();
  }

  async function removeFriend(id: number) {
    await fetch('/api/friends/remove', {
      method: 'POST',
      body: JSON.stringify({ userId: id }),
    });
    fetchFriends();
  }

  function validateEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  return (
    <div className="space-y-6">
      {/* Add/Search Friend */}
      <div>
        <h3 className="text-lg font-semibold">Add a Friend</h3>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleSearch} disabled={!search.trim()}>Search</Button>
        </div>

        {searchResult && (
          <div className="mt-2 flex justify-between items-center bg-muted p-2 rounded-md">
            <div key={searchResult.id}>
              {(searchResult.username || 'Unnamed')} ({searchResult.email})
            </div>
            <Button size="sm" onClick={() => sendRequest(searchResult.id)}>Send Request</Button>
          </div>
        )}

        {noUserFound && (
          <div className="mt-3 p-3 bg-muted rounded-md border border-red-500 text-red-600">
            <p>No users found. Do you want to invite them to use the app?
            <Button onClick={handleSendInvite} disabled={!search.trim()}>
              Send Invitation
            </Button>
            </p>
          </div>
        )}
      </div>

      {/* Incoming Requests */}
      <div>
        <h3 className="text-lg font-semibold">Incoming Requests</h3>
        <ul className="mt-2 space-y-2">
          {incomingRequests.length === 0 && <p className="text-sm text-muted-foreground">No incoming requests</p>}
          {incomingRequests.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
              <span>{user.email}</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => acceptRequest(user.id)}>Accept</Button>
                <Button size="sm" variant="outline" onClick={() => declineRequest(user.id)}>Decline</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Sent Requests */}
      <div>
        <h3 className="text-lg font-semibold">Sent Requests</h3>
        <ul className="mt-2 space-y-2">
          {sentRequests.length === 0 && <p className="text-sm text-muted-foreground">No sent requests</p>}
          {sentRequests.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
              <span>{user.email}</span>
              <span className="text-sm text-muted-foreground">Pending...</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Current Friends */}
      <div>
        <h3 className="text-lg font-semibold">Your Friends</h3>
        <ul className="mt-2 space-y-2">
          {friends.length === 0 && <p className="text-sm text-muted-foreground">You have no friends yet</p>}
          {friends.map((user) => (
            <li key={user.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
              <span>{user.email}</span>
              <Button size="sm" variant="default" onClick={() => removeFriend(user.id)}>Remove</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
