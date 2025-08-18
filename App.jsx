import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./midnight-ui/src/layouts/MainLayout";
import Home from "./midnight-ui/src/pages/Home";
import NewUser from "./midnight-ui/src/pages/NewUser";
import ActiveProjects from "./midnight-ui/src/pages/ActiveProjects";
import Profile from "./midnight-ui/src/pages/Profile";
import CreatorPage from "./midnight-ui/src/pages/CreatorPage";
import { UserProvider } from "./midnight-ui/src/contexts/UserContext";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Main layout route */}
          <Route path="/" element={<MainLayout />}>
            {/* Nested routes render inside MainLayout's <Outlet /> */}
            <Route index element={<Home />} />
            <Route path="new-user" element={<NewUser />} />
            <Route path="profile/:uid" element={<Profile />} />
            <Route path="active-projects" element={<ActiveProjects />} />
            <Route path="/creator-page/:uid" element={<CreatorPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

