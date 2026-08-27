import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { getCarImage, formatINR } from '../utils/carData';
import { X, Calendar, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Lock, Tag, Clock } from 'lucide-react';

export default function BookingModal({ car, isOpen, onClose, onBookingSuccess, onRequireAuth }) {
  const { isAuthenticated, user } = useAuth();
  
  // Default dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(todayStr);
  const [dateTo, setDateTo] = useState(tomorrowStr);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setDateFrom(todayStr);
      setDateTo(tomorrowStr);
      setError('');
      setConfirmedBooking(null);
    }
  }, [isOpen, car]);

  if (!isOpen || !car) return null;

  // Calculate rental duration and total price in INR
  const fromTime = new Date(dateFrom).getTime();
  const toTime = new Date(dateTo).getTime();
  const diffDays = Math.max(1, Math.ceil((toTime - fromTime) / (1000 * 60 * 60 * 24)));
  const isValidRange = toTime > fromTime;
  const totalAmount = isValidRange ? diffDays * car.price_per_day : car.price_per_day;

  const imageUrl = getCarImage(car.name, car.fuel_type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!isValidRange) {
      setError('Drop-off date must be strictly after Pick-up date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const rentalPayload = {
        car_id: car.id,
        date_from: new Date(dateFrom).toISOString(),
        date_to: new Date(dateTo).toISOString(),
        total_amt: totalAmount,
      };

      const result = await api.createRental(rentalPayload);
      setConfirmedBooking(result);
      if (onBookingSuccess) {
        onBookingSuccess(result, car);
      }
    } catch (err) {
      setError(err.message || 'Booking could not be confirmed. The car may already be reserved for these dates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--accent-primary)" />
            <h3 className="modal-title">
              {confirmedBooking ? 'Reservation Confirmed' : 'Book Self-Drive Car'}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose} id="booking-modal-close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {confirmedBooking ? (
            /* Confirmation Receipt View */
            <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--accent-emerald-dim)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <CheckCircle2 size={30} color="var(--accent-emerald)" />
              </div>

              <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>
                Booking Confirmed!
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Your self-drive reservation for <strong style={{ color: '#ffffff', textTransform: 'capitalize' }}>{car.name}</strong> is locked in PostgreSQL.
              </p>

              {/* Receipt Summary Card */}
              <div
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>Customer</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user?.name || user?.username}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>Pick-up</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{dateFrom}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>Drop-off</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{dateTo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>Duration</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{diffDays} {diffDays === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--border-dim)',
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>Total Paid (₹ INR)</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 800, fontSize: '1.15rem' }}>
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ width: '100%' }}
                id="booking-done-btn"
              >
                Done
              </button>
            </div>
          ) : (
            /* Booking Form View */
            <form onSubmit={handleSubmit}>
              
              {/* Selected Car Info Banner */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  background: 'var(--bg-surface-1)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-dim)',
                  marginBottom: '1.25rem',
                  alignItems: 'center',
                }}
              >
                <img
                  src={imageUrl}
                  alt={car.name}
                  style={{
                    width: '90px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-xs)',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', textTransform: 'capitalize' }}>
                      {car.name}
                    </h4>
                    <span className="badge badge-cyan" style={{ fontSize: '0.675rem' }}>
                      {car.fuel_type}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                    {formatINR(car.price_per_day)} per day
                  </span>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--accent-rose-dim)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: 'var(--accent-rose)',
                    fontSize: '0.825rem',
                    marginBottom: '1.15rem',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Date Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.15rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="booking-date-from">
                    Pick-up Date
                  </label>
                  <input
                    type="date"
                    id="booking-date-from"
                    min={todayStr}
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="booking-date-to">
                    Drop-off Date
                  </label>
                  <input
                    type="date"
                    id="booking-date-to"
                    min={dateFrom || todayStr}
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div
                style={{
                  background: 'var(--bg-surface-1)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--border-dim)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  <span>
                    Daily Rate: {formatINR(car.price_per_day)} × {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
                  </span>
                  <span>{formatINR(diffDays * car.price_per_day)}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheck size={14} color="var(--accent-emerald)" />
                    24x7 RSA & GST
                  </span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>INCLUDED</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Tag size={14} color="var(--accent-primary)" />
                    Fastag Toll Pass
                  </span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>ENABLED</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid var(--border-dim)',
                    marginTop: '0.4rem',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Total Amount</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {isAuthenticated ? (
                <button
                  type="submit"
                  disabled={loading || !isValidRange}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem' }}
                  id="confirm-booking-btn"
                >
                  {loading ? 'Processing...' : `Confirm Booking (${formatINR(totalAmount)})`}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={onRequireAuth}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.8rem' }}
                    id="booking-signin-btn"
                  >
                    <Lock size={15} />
                    <span>Sign In to Complete Booking</span>
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.775rem', color: 'var(--text-tertiary)' }}>
                    Don't have an account? Registration takes 10 seconds.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
