import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter import
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Insights from "./pages/Insights";
import MapPage from "./pages/MapPage";
import Operations from "./pages/Operations";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddFarmer from "./pages/AddFarmer";
import FarmersPage from "./pages/FarmersPage";
import ModeratorProfile from "../src/pages/moderator/ModeratorProfile";
import ModeratorLogin from "../src/pages//moderator/ModeratorLogin";
import ModeratorSignup from "../src/pages//moderator/ModeratorSignup";
const AppRoutes: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/moderator-profile" element={<ModeratorProfile />} />
        <Route path="/moderator-login" element={<ModeratorLogin />} />
        <Route path="/moderator-signup" element={<ModeratorSignup />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/insights" element={<Insights />} />
        {/*<Route path="/profile" element={<Profile />} />*/}
        <Route path="/map" element={<MapPage />} />
        <Route path="/ops" element={<Operations />} />
        <Route path = "/login" element = {<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-farmer" element={<AddFarmer />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/moderator-profile" element={<ModeratorProfile />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />

      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;

