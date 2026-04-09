import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Tickets from './pages/Tickets';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AdminBookings from './pages/admin/AdminBookings';
import AdminTickets from './pages/admin/AdminTickets';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppShell />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f1629' }}>
      {!isLoginPage && <Navbar />}
      <main className={isLoginPage ? 'flex-1 w-full overflow-hidden' : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/resources"      element={<Resources />} />
            <Route path="/resources/:id"  element={<ResourceDetail />} />
            <Route path="/bookings"       element={<Bookings />} />
            <Route path="/bookings/:id"   element={<BookingDetail />} />
            <Route path="/tickets"        element={<Tickets />} />
            <Route path="/notifications"  element={<Notifications />} />
            <Route path="/profile"        element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/tickets"  element={<AdminTickets />} />
            <Route path="/admin/users"    element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
