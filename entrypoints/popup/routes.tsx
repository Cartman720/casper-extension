import { useState, useEffect } from "react";
import { storage } from "wxt/storage";
import { Routes, Route, Navigate, useNavigation, useLocation } from "react-router";
import MainPage from "./pages/main";
import LoginPage from "./pages/login";
import SettingsPage from "./pages/settings";
import SignupPage from "./pages/signup";

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    storage.getItem("session:auth_token").then((token) => {
      setIsLoggedIn(!!token);
    });
  }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <MainPage /> : <Navigate replace to="/login" />}
      />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate replace to="/" /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate replace to="/" /> : <SignupPage />}
      />
      <Route
        path="/settings"
        element={isLoggedIn ? <SettingsPage /> : <Navigate replace to="/login" />}
      />
    </Routes>
  );
}

export default AppRoutes;
