import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./midnight-ui/src/layouts/MainLayout";
import Home from "./midnight-ui/src/pages/Home";
import NewUser from "./midnight-ui/src/pages/NewUser";

export default function App() {
  return (
      <Router>
         <MainLayout>
             <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-user" element={<NewUser />} />
              {/* Add more pages here later */}
             </Routes>
        </MainLayout>
      </Router>
      );
 }