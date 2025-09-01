import { Outlet } from "react-router-dom";
import SessionProvider from "../api/SessionProvider";

const ProtectedLayout = () => {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
};

export default ProtectedLayout;