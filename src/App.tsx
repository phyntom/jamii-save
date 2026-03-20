import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Overview from "./pages/Overview";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import CommunityForm from "./pages/CommunityForm";
import OverviewLayout from "./components/layout/OverviewLayout";
import MainLayout from "./components/layout/MainLayout";
import RequestFund from "./pages/RequestFund";
import Contribute from "./pages/Contribute";
import Members from "./pages/Members";
import Approvals from "./pages/Approvals";
import Dashboard from "./pages/Dashboard";
import CommunityEdit from "./pages/CommunityEdit";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<OverviewLayout />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/communities/new" element={<CommunityForm />} />
        </Route>
        <Route path="/communities/:slug" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/communities/:slug/manage" element={<CommunityEdit />} />
          <Route path="contribute" element={<Contribute />} />
          <Route path="request" element={<RequestFund />} />

          <Route path="admin/members" element={<Members />} />
          <Route path="admin/contributions" element={<Approvals />} />
          <Route path="admin/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
