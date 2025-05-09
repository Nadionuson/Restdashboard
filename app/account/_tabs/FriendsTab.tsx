'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddFriend from '../../../components/AddFriend';
import IncomingRequests from '../../../components/IncomingRequests';
import SentRequests from '../../../components/SentRequests';
import CurrentFriends from '../../../components/CurrentFriends';

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
      <AddFriend
        search={search}
        setSearch={setSearch}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        noUserFound={noUserFound}
        handleSearch={handleSearch}
        handleSendInvite={handleSendInvite}
        sendRequest={sendRequest}
      />

      {/* Incoming Requests */}
      <IncomingRequests
        incomingRequests={incomingRequests}
        acceptRequest={acceptRequest}
        declineRequest={declineRequest}
      />

      {/* Sent Requests */}
      <SentRequests sentRequests={sentRequests} />

      {/* Current Friends */}
      <CurrentFriends friends={friends} removeFriend={removeFriend} />
    </div>
  );
}
