import { storage } from '#imports';
import { useNavigate } from 'react-router';
import { Header } from '@/entrypoints/popup/components/header';

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 flex-col items-center justify-center">
      <Header />
    </div>
  );
}

export default MainPage;
