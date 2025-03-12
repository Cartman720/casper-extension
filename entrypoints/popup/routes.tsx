import { useState, useEffect } from 'react';
import { storage } from 'wxt/storage';
import {
  Routes,
  Route,
  Navigate,
  useNavigation,
  useLocation,
} from 'react-router';
import MainPage from './pages/main';
import LoginPage from './pages/login';
import SettingsPage from './pages/settings';
import SignupPage from './pages/signup';
import { MainLayout } from './components/main-layout';
import { HistoryPage } from './pages/history';
import { ActionsPage } from './pages/actions';

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    storage.getItem('session:auth_token').then((token) => {
      setIsLoggedIn(!!token);
    });
  }, [location]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate replace to="/" /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate replace to="/" /> : <SignupPage />}
      />

      <Route
        element={isLoggedIn ? <MainLayout /> : <Navigate replace to="/login" />}
      >
        <Route path="/" element={<ActionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
