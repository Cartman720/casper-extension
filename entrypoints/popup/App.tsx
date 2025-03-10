import { useState } from "react";
import tiktokLogo from "@/assets/tiktok.jpg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex gap-4 flex-col items-center justify-center p-6">
      <div className="text-center">
        <a href="https://tiktok.com" target="_blank">
          <img
            src={tiktokLogo}
            className="w-[200px]"
            alt="WXT logo"
          />
        </a>
      </div>

      <h1 className="!text-xl font-bold text-center">
        TikTok AI Assistant
      </h1>

      <div className="text-base text-center">
        The extension that helps you generate TikTok comments with AI.
      </div>
    </div>
  );
}

export default App;
