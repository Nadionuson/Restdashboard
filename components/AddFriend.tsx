import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddFriendProps {
  search: string;
  setSearch: (value: string) => void;
  searchResult: any;
  setSearchResult: (result: any) => void;
  noUserFound: boolean;
  handleSearch: () => void;
  handleSendInvite: () => void;
  sendRequest: (id: number) => void;
}

const AddFriend = ({
  search,
  setSearch,
  searchResult,
  setSearchResult,
  noUserFound,
  handleSearch,
  handleSendInvite,
  sendRequest,
}: AddFriendProps) => (
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
);

export default AddFriend;
