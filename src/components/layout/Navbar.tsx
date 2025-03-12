
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { BarChart, MessageSquare, FileText, Settings } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: <BarChart className="h-5 w-5" /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Reports", path: "/reports", icon: <FileText className="h-5 w-5" /> },
    { name: "Templates", path: "/templates", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="container mx-auto flex justify-center md:justify-between items-center py-3 md:py-4 px-4">
        <div className="hidden md:flex items-center space-x-2">
          <span className="font-semibold text-lg tracking-tight text-primary">HealthBuddie</span>
        </div>
        
        <ul className="flex items-center space-x-1 md:space-x-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <span className="md:mr-2">{item.icon}</span>
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
