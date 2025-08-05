import { LogOut, Building, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wellness Event Platform</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.role === "hr" ? "HR Manager" : "Vendor"})
                {user?.companyName && ` - ${user.companyName}`}
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1">
              {user?.role === "hr" ? (
                <Link
                  to="/hr-dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/hr-dashboard")
                      ? "bg-sky-100 text-sky-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Building className="w-4 h-4 inline mr-2" />
                  HR Dashboard
                </Link>
              ) : (
                <Link
                  to="/vendor-dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/vendor-dashboard")
                      ? "bg-sky-100 text-sky-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Vendor Dashboard
                </Link>
              )}
            </nav>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
