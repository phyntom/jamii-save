import { NavLink, Outlet } from "react-router";
import {
  BarChart3,
  FileText,
  Shield,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/groups", label: "Groups", icon: Shield },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 border-r bg-background flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-semibold text-foreground">Admin Panel</span>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t flex items-center justify-between">
          <NavLink
            to="/overview"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            &larr; Back to App
          </NavLink>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
