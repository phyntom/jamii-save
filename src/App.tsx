import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import OverviewLayout from "./components/layout/OverviewLayout";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Community pages
import CommunityForm from "./pages/community/CommunityForm";
import Dashboard from "./pages/community/Dashboard";
import CommunityEdit from "./pages/community/CommunityEdit";
import Contribute from "./pages/community/Contribute";
import RequestFund from "./pages/community/RequestFund";
import Members from "./pages/community/Members";
import Approvals from "./pages/community/Approvals";
import Settings from "./pages/community/Settings";

// Contributions pages
import Contributions from "./pages/contributions/Contributions";
import ContributionCreate from "./pages/contributions/ContributionCreate";

// Loans pages
import Loans from "./pages/loans/Loans";
import LoanDetail from "./pages/loans/LoanDetail";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGroups from "./pages/admin/AdminGroups";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<OverviewLayout />}>
          <Route path="/overview" element={<Overview />} />
          <Route path="/communities/new" element={<CommunityForm />} />
          <Route path="/contributions" element={<Contributions />} />
          <Route path="/contributions/new" element={<ContributionCreate />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loans/:id" element={<LoanDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/communities/:slug" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="admin/edit" element={<CommunityEdit />} />
          <Route path="contribute" element={<Contribute />} />
          <Route path="request" element={<RequestFund />} />
          <Route path="admin/members" element={<Members />} />
          <Route path="admin/contributions" element={<Approvals />} />
          <Route path="admin/settings" element={<Settings />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="groups" element={<AdminGroups />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>
      </Route>
    </Routes>
  );
}
