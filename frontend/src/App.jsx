import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f1629' }}>
            <Navbar />
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes (Any Authenticated User) */}
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

                {/* Protected Routes (Admin Only) */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/bookings" element={<AdminBookings />} />
                  <Route path="/admin/tickets"  element={<AdminTickets />} />
                  <Route path="/admin/users"    element={<AdminUsers />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
