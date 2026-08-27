import React, { useState } from 'react';
import { api } from '../api/client';
import { X, Plus, Car, Fuel, Phone, AlertCircle } from 'lucide-react';

export default function AddCarModal({ isOpen, onClose, onCarAdded }) {
  const [name, setName] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [pricePerDay, setPricePerDay] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a vehicle name.');
      return;
    }
    if (!pricePerDay || isNaN(pricePerDay) || Number(pricePerDay) <= 0) {
      setError('Please enter a valid daily rate in ₹ INR.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newCar = await api.createCar({
        name: name.trim(),
        fuel_type: fuelType,
        price_per_day: Number(pricePerDay),
        phone: phone.trim(),
      });

      setName('');
      setFuelType('Petrol');
      setPricePerDay('');
      setPhone('');
      if (onCarAdded) {
        onCarAdded(newCar);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add vehicle to PostgreSQL database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="var(--accent-primary)" />
            <h3 className="modal-title">Add Vehicle to Fleet</h3>
          </div>
          <button className="modal-close" onClick={onClose} id="add-car-modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
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

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="car-name-input">
                Vehicle Make & Model
              </label>
              <div style={{ position: 'relative' }}>
                <Car
                  size={16}
                  color="var(--text-tertiary)"
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="text"
                  id="car-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mahindra Thar 4x4 / Fortuner"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="car-fuel-select">
                Powertrain / Fuel Type
              </label>
              <div style={{ position: 'relative' }}>
                <Fuel
                  size={16}
                  color="var(--text-tertiary)"
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <select
                  id="car-fuel-select"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="form-select"
                  style={{ paddingLeft: '2.5rem' }}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric (EV)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="car-price-input">
                Daily Rental Rate (₹ INR)
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    fontSize: '0.9rem',
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  id="car-price-input"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  placeholder="e.g. 2500"
                  min="1"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="car-phone-input">
                Contact Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={16}
                  color="var(--text-tertiary)"
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  type="tel"
                  id="car-phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1 }}
                id="submit-add-car-btn"
              >
                {loading ? 'Saving...' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
