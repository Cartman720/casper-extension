import { storage } from "wxt/storage";
import { useNavigate } from "react-router";
import tiktokLogo from "@/assets/tiktok.jpg";

function MainPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.removeItem('session:auth_token').then(() => {
      navigate('/login');
    });
  };

  return (
    <div className="flex gap-4 flex-col items-center justify-center p-6">
      <div className="text-center">
        <a href="https://tiktok.com" target="_blank">
          <img src={tiktokLogo} className="w-[200px]" alt="WXT logo" />
        </a>
      </div>

      <h1 className="!text-xl font-bold text-center">TikTok AI Assistant</h1>

      <div className="text-base text-center">
        The extension that helps you generate TikTok comments with AI.
      </div>

      <a href="#login">Login with TikTok</a>
      <a href="#settings">Settings</a>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default MainPage;
