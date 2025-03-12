import { LogOut } from "lucide-react";

import { CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import { useNavigate } from "react-router";

export function ProfileDropdown() {
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.removeItem('session:auth_token').then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="dropdown dropdown-end">
      <div className="avatar" role="button" tabIndex={0}>
        <div className="ring-primary ring-2 bg-white text-black mask mask-squircle w-6">
          <User2 className="w-full h-full" />
        </div>
      </div>

      <ul
        className={cn(
          'dropdown-content rounded-box z-1 w-40 p-2 shadow-sm mt-2 menu',
          'bg-white text-black',
          '[&_a]:flex [&_a]:justify-between [&_a]:items-center',
        )}
      >
        <li>
          <a>
            Profile <User2 className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a>
            Subscription <CreditCard className="w-4 h-4" />
          </a>
        </li>
        <li>
          <a>
            Logout <LogOut className="w-4 h-4" />
          </a>
        </li>
      </ul>
    </div>
  );
}
