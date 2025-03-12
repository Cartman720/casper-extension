import { ProfileDropdown } from './profile-dropdown';
import { Sidebar } from './sidebar';

export function Header() {
  return (
    <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-black p-3 text-white">
      <div className="flex items-center gap-2">
        <Sidebar />

        <h1 className="font-rift !text-xl font-bold italic">Casper</h1>
      </div>

      <ProfileDropdown />
    </div>
  );
}
