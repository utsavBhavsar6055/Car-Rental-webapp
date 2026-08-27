import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getCarImage, formatINR } from '../utils/carData';
import { X, CalendarCheck, Calendar, Fuel, RefreshCw, Car, Phone } from 'lucide-react';

export default function MyBookingsModal({ isOpen, onClose, onExploreFleet }) {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRentals = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMyRentals();
      setRentals(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRentals();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarCheck size={18} color="var(--accent-cyan)" />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>
                My Bookings & Rentals
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Account: {user?.name || user?.username}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} id="bookings-modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '3rem 0', textAlign: 'center' }}>
              <RefreshCw
                size={30}
                color="var(--accent-cyan)"
                style={{ animation: 'spin 1.2s linear infinite', margin: '0 auto 0.75rem' }}
              />
              <p style={{ color: 'var(--text-secondary)' }}>Loading your reservations...</p>
            </div>
          ) : error ? (
            <div
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                color: 'var(--accent-rose)',
                background: 'rgba(244, 63, 94, 0.1)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {error}
            </div>
          ) : rentals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rentals.map((rental, index) => {
                const img = getCarImage(rental.car_name, rental.fuel_type);
                const fromFormatted = rental.date_from ? rental.date_from.split('T')[0] : 'N/A';
                const toFormatted = rental.date_to ? rental.date_to.split('T')[0] : 'N/A';

                return (
                  <div
                    key={`${rental.car_id}-${index}`}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={img}
                      alt={rental.car_name}
                      style={{
                        width: '90px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', textTransform: 'capitalize' }}>
                          {rental.car_name}
                        </h4>
                        <span
                          className="badge badge-emerald"
                          style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}
                        >
                          CONFIRMED
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                          marginTop: '0.4rem',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} color="var(--accent-cyan)" />
                          <span>
                            {fromFormatted} → {toFormatted}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Fuel size={13} color="var(--accent-amber)" />
                          <span>{rental.fuel_type}</span>
                        </div>

                        {rental.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Phone size={13} color="var(--accent-emerald)" />
                            <span>{rental.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '85px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Paid</div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        {formatINR(rental.total_amt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Car size={26} color="var(--accent-cyan)" />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                No Active Bookings
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                You haven't reserved any vehicles yet. Explore our fleet across India and book your next drive.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onExploreFleet) onExploreFleet();
                }}
                className="btn btn-primary btn-sm"
              >
                Explore Fleet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
