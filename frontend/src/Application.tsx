import { Outlet } from "react-router-dom";

import { useTheme } from "./hooks/useTheme";
import SideBar from "./components/SideBar";
import NavigationBar from "./components/Navbar";

const App = () => {
  useTheme();
  return (
    <div className="h-screen pargarX relative">
      <div className="fixed flex lg:flex-row flex-col bg-background h-full w-full top-0 left-0">
        <NavigationBar />
        <SideBar /> 
        <main className="lg:px-0 flex flex-col overflow-y-auto h-screen w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
