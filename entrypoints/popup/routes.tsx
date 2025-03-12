import { useState, useEffect } from 'react';
import { storage } from 'wxt/storage';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router';
import { MainLayout } from './components/main-layout';
import { HistoryPage } from './pages/history';
import { ActionsPage } from './pages/actions';
import { LoginPage } from './pages/login';
import { SettingsPage } from './pages/settings';
import { SignupPage } from './pages/signup';
import { CreateActionPage } from './pages/actions/create-action';
import { ForgotPasswordPage } from './pages/forgot-password';

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
      <Route element={isLoggedIn ? <Navigate replace to="/" /> : <Outlet />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route
        element={isLoggedIn ? <MainLayout /> : <Navigate replace to="/login" />}
      >
        <Route path="/" element={<ActionsPage />} />
        <Route path="/actions/create" element={<CreateActionPage />} />
        <Route path="/actions/:id" element={<CreateActionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
