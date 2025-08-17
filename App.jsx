import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./midnight-ui/src/layouts/MainLayout";
import Home from "./midnight-ui/src/pages/Home";
import NewUser from "./midnight-ui/src/pages/NewUser";
import ActiveProjects from "./midnight-ui/src/pages/ActiveProjects";
import Profile from "./midnight-ui/src/pages/Profile"; // import your Profile page
import { UserProvider } from "./midnight-ui/src/contexts/UserContext"; // import the context provider

export default function App() {
  return (
    <UserProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-user" element={<NewUser />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route path="/active-projects" element={<ActiveProjects />} />
          </Routes>
        </MainLayout>
      </Router>
    </UserProvider>
  );
}
