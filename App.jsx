import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./midnight-ui/src/layouts/MainLayout";
import Home from "./midnight-ui/src/pages/Home";
import NewUser from "./midnight-ui/src/pages/NewUser";
import ActiveProjects from "./midnight-ui/src/pages/ActiveProjects";
import Profile from "./midnight-ui/src/pages/Profile";
import CreatorPage from "./midnight-ui/src/pages/CreatorPage";
import Events from "./midnight-ui/src/pages/Events";
import Search from "./midnight-ui/src/pages/Search";

// Updated imports for content pages
import Watch from "./midnight-ui/src/pages/content/Watch";
import Listen from "./midnight-ui/src/pages/content/Listen";
import Read from "./midnight-ui/src/pages/content/Read";
import Play from "./midnight-ui/src/pages/content/Play";

import { UserProvider } from "./midnight-ui/src/contexts/UserContext";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="new-user" element={<NewUser />} />
            <Route path="profile/:uid" element={<Profile />} />
            <Route path="active-projects" element={<ActiveProjects />} />
            <Route path="creator-page/:uid" element={<CreatorPage />} />
            <Route path="events" element={<Events />} />
            <Route path="search" element={<Search />} />

            {/* Content routes */}
            <Route path="watch" element={<Watch />} />
            <Route path="listen" element={<Listen />} />
            <Route path="read" element={<Read />} />
            <Route path="play" element={<Play />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}
