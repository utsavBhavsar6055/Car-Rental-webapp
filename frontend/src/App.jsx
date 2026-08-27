import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './api/client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FleetList from './components/FleetList';
import FeaturesSection from './components/FeaturesSection';
import BookingModal from './components/BookingModal';
import AddCarModal from './components/AddCarModal';
import AuthModal from './components/AuthModal';
import MyBookingsModal from './components/MyBookingsModal';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';

function AppContent() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [dateFrom, setDateFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Modals state
  const [bookingCar, setBookingCar] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch cars directly from your PostgreSQL backend via GET /showcar
  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await api.getCars(dateFrom, dateTo);
      setCars(data || []);
    } catch (err) {
      showToast(err.message || 'Could not connect to FastAPI backend at http://localhost:8000', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleFindCars = () => {
    if (!dateFrom || !dateTo || dateTo <= dateFrom) {
      showToast('Choose a drop-off date later than the pick-up date.', 'error');
      return;
    }
    fetchCars();
  };

  // Delete car
  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from the fleet?')) return;
    try {
      await api.deleteCar(carId);
      setCars(cars.filter((c) => c.id !== carId));
      showToast('Vehicle deleted successfully from database', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete vehicle', 'error');
    }
  };

  // Handle vehicle added
  const handleCarAdded = (newCar) => {
    setCars((prev) => [...prev, newCar]);
    showToast(`"${newCar.name}" added to the fleet!`, 'success');
  };

  // Handle booking success
  const handleBookingSuccess = (rental, car) => {
    showToast(`Booking confirmed for ${car.name}! View details in My Bookings.`, 'success');
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Navigation Bar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenAddCar={() => setIsAddCarOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        carCount={cars.length}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFuel={selectedFuel}
        setSelectedFuel={setSelectedFuel}
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        onExploreClick={handleFindCars}
      />

      {/* Fleet Catalog Section */}
      <FleetList
        cars={cars}
        loading={loading}
        searchQuery={searchQuery}
        selectedFuel={selectedFuel}
        setSelectedFuel={setSelectedFuel}
        onRent={(car) => setBookingCar(car)}
        onDelete={handleDeleteCar}
        onAddCar={() => setIsAddCarOpen(true)}
        onRefresh={fetchCars}
      />

      {/* Features, Experience & Footer */}
      <FeaturesSection />

      {/* Booking Modal */}
      <BookingModal
        car={bookingCar}
        isOpen={!!bookingCar}
        onClose={() => setBookingCar(null)}
        onBookingSuccess={handleBookingSuccess}
        onRequireAuth={() => {
          setIsAuthOpen(true);
          setAuthMode('login');
        }}
      />

      {/* Add Car Modal */}
      <AddCarModal
        isOpen={isAddCarOpen}
        onClose={() => setIsAddCarOpen(false)}
        onCarAdded={handleCarAdded}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          showToast('Authenticated successfully!', 'success');
        }}
      />

      {/* My Bookings Modal */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onExploreFleet={() => {
          const fleetElem = document.getElementById('fleet');
          if (fleetElem) fleetElem.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <Chatbot dateFrom={dateFrom} dateTo={dateTo} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
