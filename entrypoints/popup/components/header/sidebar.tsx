import { cn } from '@/lib/utils';
import { Clock, Menu, Sparkles, X } from 'lucide-react';
import { NavLink } from 'react-router';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        className="btn btn-ghost btn-circle border-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'group absolute inset-0 h-full w-full',
          'data-[state=closed]:h-0 data-[state=open]:h-full',
        )}
      >
        <div
          className={cn(
            'absolute inset-0 h-full w-full bg-black/50',
            'will-change-opacity transition-opacity transition-discrete duration-500',
            'group-data-[state=closed]:opacity-0 group-data-[state=open]:opacity-100',
          )}
          onClick={handleClose}
        />

        <div
          className={cn(
            'fixed top-0 left-0 h-full w-56',
            'bg-white text-black',
            'transform-discrete transition-transform duration-300 will-change-transform',
            'group-data-[state=closed]:-translate-x-full group-data-[state=open]:translate-x-0',
          )}
        >
          <div className="bg-primary mb-2 flex items-center justify-between p-2">
            <h2 className="text-lg font-bold text-white">Settings</h2>

            <button
              onClick={handleClose}
              className="btn btn-sm btn-ghost btn-circle border-none text-white hover:bg-white hover:text-black"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <ul className="flex flex-col gap-2 px-2">
            <SidebarItem to="/">
              Actions <Sparkles className="h-4 w-4" />
            </SidebarItem>

            <SidebarItem to="/history">
              History <Clock className="h-4 w-4" />
            </SidebarItem>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  to: string;
  children: React.ReactNode;
}

function SidebarItem({ to, children }: SidebarItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={cn(
          'flex items-center gap-2 text-base',
          'rounded-md p-2 bg-gray-100',
          'transition-colors duration-300 hover:bg-gray-200',
        )}
      >
        {children}
      </NavLink>
    </li>
  );
}
