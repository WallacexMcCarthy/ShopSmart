import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet  } from 'react-router-dom';
import SignUpForm from './Pages/SignUpForm';
import LoginForm from './Pages/Login';
import MainPage from './Pages/MainPage'; 
import HomePage from './Pages/Home';
import HistoryPage from './Pages/History';
import { UserProvider, useUser } from './UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          
          {/* Protected Routes with MainPage as a wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainPage />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<CatchAllRedirect />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

// Inline ProtectedRoute function
function ProtectedRoute() {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/login" />;
}

// Catch-All Redirect Component
function CatchAllRedirect() {
  const { user } = useUser();
  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

export default App;
