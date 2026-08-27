import React from 'react';
import { getCarImage, getCarSpecs, formatINR } from '../utils/carData';
import { Fuel, Users, Gauge, Zap, Key, Trash2, ArrowRight, ShieldCheck, Check, Phone } from 'lucide-react';

export default function CarCard({ car, onRent, onDelete }) {
  const imageUrl = getCarImage(car.name, car.fuel_type);
  const specs = getCarSpecs(car.name, car.fuel_type);

  const getFuelBadgeClass = (fuel) => {
    const f = (fuel || '').toLowerCase();
    if (f.includes('electric') || f.includes('ev')) return 'badge-cyan';
    if (f.includes('diesel')) return 'badge-amber';
    if (f.includes('hybrid')) return 'badge-emerald';
    return 'badge-neutral';
  };

  return (
    <div
      className="pro-card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top Image Container */}
      <div
        style={{
          position: 'relative',
          height: '210px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#0a0d14',
        }}
      >
        <img
          src={imageUrl}
          alt={car.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        {/* Shading Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(8, 10, 15, 0.1) 0%, rgba(8, 10, 15, 0.75) 100%)',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 2,
          }}
        >
          <span className={`badge ${getFuelBadgeClass(car.fuel_type)}`}>
            {car.fuel_type}
          </span>
        </div>

        {/* Free Fastag tag */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            color: 'var(--text-secondary)',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        >
          Fastag
        </div>
      </div>

      {/* Card Content Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Title & Daily Rate Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'capitalize',
                lineHeight: 1.25,
              }}
            >
              {car.name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              Self-Drive • Verified Fleet
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-pure)',
                lineHeight: 1,
              }}
            >
              {formatINR(car.price_per_day)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>per day</span>
          </div>
        </div>

        {/* Contact Phone (if available) */}
        {car.phone && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              color: 'var(--accent-primary)',
              background: 'var(--accent-primary-dim)',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              marginBottom: '0.75rem',
            }}
          >
            <Phone size={13} color="var(--accent-primary)" />
            <span>{car.phone}</span>
          </div>
        )}

        {/* Specs Pill Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.45rem',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface-1)',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-dim)',
            }}
          >
            <Users size={13} color="var(--text-tertiary)" />
            <span>{specs.seats}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface-1)',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-dim)',
            }}
          >
            <Gauge size={13} color="var(--text-tertiary)" />
            <span>{specs.mileage}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface-1)',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-dim)',
            }}
          >
            <Key size={13} color="var(--text-tertiary)" />
            <span>{specs.transmission}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.775rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface-1)',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-dim)',
            }}
          >
            <ShieldCheck size={13} color="var(--text-tertiary)" />
            <span>{specs.features}</span>
          </div>
        </div>

        {/* Action Button Footer */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-dim)',
          }}
        >
          <button
            onClick={() => onRent(car)}
            className="btn btn-primary"
            style={{ flex: 1 }}
            id={`rent-car-btn-${car.id}`}
          >
            <span>Book Now</span>
            <ArrowRight size={15} />
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(car.id)}
              className="btn btn-secondary btn-sm"
              title="Delete car"
              style={{ padding: '0.6rem' }}
              id={`delete-car-btn-${car.id}`}
            >
              <Trash2 size={15} color="var(--accent-rose)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
