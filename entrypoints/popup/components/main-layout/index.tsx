import { Outlet } from 'react-router';
import { Header } from '../header';

export function MainLayout() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Header />
      <Outlet />
    </div>
  );
}
