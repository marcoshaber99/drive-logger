import Link from "next/link";
import { Home, Car, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Drives", href: "/dashboard/drives", icon: Car },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex flex-col h-full w-64 border-r">
      <div className="p-4">
        <h1 className="text-2xl font-bold ">DriveLogger</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center p-2  rounded-md"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
