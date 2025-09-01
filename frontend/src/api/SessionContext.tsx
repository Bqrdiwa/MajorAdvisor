import * as React from "react";

export interface Session {
  role: "ADMIN" | "USER";
  state: "Nothing" | "CompleteInformation" | "Paid" | "SentEvidence" | "Final";
  evidenceStatus: null | "NotSeen" | "Approved" | "Rejected";
}

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session) => void;
}
const SessionContext = React.createContext<SessionContextType>({
  session: null,
  setSession: () => {},
});
export default SessionContext;
export const useSession = () => React.useContext(SessionContext);
