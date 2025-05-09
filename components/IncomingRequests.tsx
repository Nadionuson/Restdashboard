import { Button } from '@/components/ui/button';

interface IncomingRequestsProps {
  incomingRequests: any[];
  acceptRequest: (id: number) => void;
  declineRequest: (id: number) => void;
}

const IncomingRequests = ({
  incomingRequests,
  acceptRequest,
  declineRequest,
}: IncomingRequestsProps) => (
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
);

export default IncomingRequests;
