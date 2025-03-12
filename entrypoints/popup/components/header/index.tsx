import { ProfileDropdown } from './profile-dropdown';
import { Sidebar } from './sidebar';

export function Header() {
  return (
    <div className="flex justify-between bg-black text-white items-center w-full p-3">
      <div className="flex items-center gap-2">
        <Sidebar />

        <h1 className="!text-xl font-bold italic font-rift">Casper</h1>
      </div>

      <ProfileDropdown />
    </div>
  );
}

