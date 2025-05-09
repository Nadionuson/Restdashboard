interface SentRequestsProps {
  sentRequests: any[];
}

const SentRequests = ({ sentRequests }: SentRequestsProps) => (
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
);

export default SentRequests;
