import { Button } from '@/components/ui/button';

interface CurrentFriendsProps {
  friends: any[];
  removeFriend: (id: number) => void;
}

const CurrentFriends = ({ friends, removeFriend }: CurrentFriendsProps) => (
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
);

export default CurrentFriends;
