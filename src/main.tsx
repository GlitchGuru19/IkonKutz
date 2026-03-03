import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AdminDashboard } from './pages/AdminDashboard';
import { BookingPage } from './pages/Booking';
import './index.css';

// Placeholder pages
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl md:text-6xl font-bold text-accent mb-4">Master Your Style</h1>
      <p className="text-xl text-muted mb-8 max-w-2xl">
        Premium grooming experience tailored for the modern gentleman.
        Book your appointment today at Ikon Cuts.
      </p>
      <div className="flex gap-4">
        <a href="/book" className="btn btn-primary text-lg px-8 py-3">Book Appointment</a>
        <a href="#services" className="btn btn-outline text-lg px-8 py-3">View Services</a>
      </div>
      {/* Placeholder for Services Section */}
      <div id="services" className="mt-24 w-full">
        <h2 className="text-2xl font-bold mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-2">Signature Cut</h3>
            <p className="text-muted mb-4">Precision haircut tailored to your style</p>
            <span className="text-accent font-bold">R 150</span>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-2">Cut & Beard</h3>
            <p className="text-muted mb-4">Complete grooming package with beard trim</p>
            <span className="text-accent font-bold">R 200</span>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-2">Line Up</h3>
            <p className="text-muted mb-4">Crisp edges and clean lines</p>
            <span className="text-accent font-bold">R 80</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="flex justify-center p-20">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requireAdmin && !isAdmin) {
    return <div className="text-center p-20 text-danger">Access Denied: Admin only area.</div>;
  }

  return children;
};

// Dashboard Wrapper
const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <p>Welcome back, {user?.email}</p>
      <div className="card p-8 text-center text-muted">
        You have no upcoming bookings.
        <br />
        <a href="/book" className="text-accent hover:underline mt-2 inline-block">Book a new cut</a>
        {/** 
           By "Customer Features > View Bookings", we could reuse BookingsList but filtered by ID.
           For now MVP: Place link to book.
          */}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="book" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<div className="p-20 text-center">Page not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
