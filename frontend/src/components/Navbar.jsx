import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Plus, User, LogOut, CalendarCheck, Menu, X, ShieldCheck, Phone } from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenAddCar, onOpenMyBookings, carCount = 0 }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        backgroundColor: 'rgba(8, 10, 15, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-dim)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.5rem',
        }}
      >
        {/* Brand Logo */}
        <a
          href="#home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--grad-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0, 210, 255, 0.3)',
            }}
          >
            <Car size={21} color="#06101e" strokeWidth={2.4} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.3rem',
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              APEX<span style={{ color: 'var(--accent-primary)' }}>DRIVE</span>
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
              }}
            >
              INDIA
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-nav"
        >
          <a
            href="#fleet"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            All Cars <span style={{ opacity: 0.6 }}>({carCount})</span>
          </a>
          <a
            href="#features"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Benefits
          </a>
          <a
            href="#how-it-works"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            How it Works
          </a>
        </nav>

        {/* Action Controls */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.75rem',
          }}
          className="desktop-actions"
        >
          <button
            onClick={onOpenAddCar}
            className="btn btn-secondary btn-sm"
            id="nav-add-car-btn"
            style={{ fontWeight: 600 }}
          >
            <Plus size={15} />
            <span>Add Vehicle</span>
          </button>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={onOpenMyBookings}
                className="btn btn-secondary btn-sm"
                id="nav-my-bookings-btn"
              >
                <CalendarCheck size={15} color="var(--accent-primary)" />
                <span>My Bookings</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.65rem',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary-dim)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name || user?.username}
                </span>
              </div>

              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
                id="nav-logout-btn"
                style={{ padding: '0.45rem' }}
              >
                <LogOut size={15} color="var(--text-tertiary)" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-secondary btn-sm"
                id="nav-login-btn"
              >
                <User size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-primary btn-sm"
                id="nav-register-btn"
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex' }}
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-surface-1)',
            borderBottom: '1px solid var(--border-dim)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <a
            href="#fleet"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-primary)', fontWeight: 500 }}
          >
            All Cars ({carCount})
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
          >
            Benefits
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
          >
            How it Works
          </a>

          <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddCar();
              }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              <Plus size={15} /> Add Vehicle
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMyBookings();
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <CalendarCheck size={15} color="var(--accent-primary)" /> My Bookings
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="btn btn-danger"
                  style={{ width: '100%' }}
                >
                  <LogOut size={15} /> Log Out ({user?.name || user?.username})
                </button>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="btn btn-secondary"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="btn btn-primary"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          #mobile-menu-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}