import React from 'react';
import { Search, Fuel, ShieldCheck, ChevronRight, MapPin, Tag, Check, Star, BadgeCheck, ArrowRight, Calendar } from 'lucide-react';

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedFuel,
  setSelectedFuel,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  onExploreClick,
}) {
  const popularCities = ['Delhi NCR', 'Mumbai', 'Bengaluru', 'Goa', 'Hyderabad', 'Pune'];

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        padding: '5.5rem 0 4rem',
        overflow: 'hidden',
      }}
    >
      {/* Cinematic Background Layers */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 50% -10%, rgba(0, 210, 255, 0.12), transparent),
            radial-gradient(ellipse 50% 40% at 85% 20%, rgba(99, 102, 241, 0.08), transparent),
            radial-gradient(ellipse 40% 30% at 10% 60%, rgba(16, 185, 129, 0.05), transparent)
          `,
          pointerEvents: 'none',
        }}
      />
      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>

          {/* Eyebrow badge with star rating */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-medium)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} color="var(--accent-amber)" fill="var(--accent-amber)" />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>4.9/5</span>
            <span style={{ width: '1px', height: '14px', background: 'var(--border-medium)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              from 12,000+ renters
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.25rem)',
              lineHeight: 1.08,
              marginBottom: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.035em',
            }}
          >
            Freedom on <span className="text-gradient">Indian Roads.</span>
            <br />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.55em', fontWeight: 600 }}>
              Self-Drive Cars, Delivered to Your Door.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.65,
            }}
          >
            Book sanitized, fully-insured self-drive cars in minutes. Transparent daily rates in ₹ INR with Fastag and 24x7 roadside assistance.
          </p>

          {/* Search & Booking Filter Console - Glass Panel */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              marginBottom: '2.5rem',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-glass-card)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.85rem',
                alignItems: 'center',
              }}
            >
              {/* Search Car Input */}
              <div style={{ position: 'relative' }}>
                <Search
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Model (Swift, Fortuner, Ertiga...)"
                  className="form-input"
                  id="hero-search-input"
                  style={{ paddingLeft: '2.5rem', height: '2.85rem', fontSize: '0.875rem' }}
                />
              </div>

              {/* Fuel Selector */}
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
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="form-select"
                  id="hero-fuel-select"
                  style={{ paddingLeft: '2.5rem', height: '2.85rem', fontSize: '0.875rem' }}
                >
                  <option value="All">All Powertrains</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Pick-up Date */}
              <div style={{ position: 'relative' }}>
                <Calendar
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
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="form-input"
                  id="hero-date-from-input"
                  aria-label="Pick-up date"
                  style={{ paddingLeft: '2.5rem', height: '2.85rem', fontSize: '0.875rem' }}
                />
              </div>

              {/* Drop-off Date */}
              <div style={{ position: 'relative' }}>
                <Calendar
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
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="form-input"
                  id="hero-date-to-input"
                  aria-label="Drop-off date"
                  style={{ paddingLeft: '2.5rem', height: '2.85rem', fontSize: '0.875rem' }}
                />
              </div>

              {/* Search Button */}
              <a
                href="#fleet"
                className="btn btn-primary"
                style={{ height: '2.85rem', textDecoration: 'none' }}
                onClick={onExploreClick}
                id="hero-explore-btn"
              >
                <span>Find Cars</span>
                <ChevronRight size={16} />
              </a>
            </div>

            {/* Popular Cities Quick Picks */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-dim)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                }}
              >
                <MapPin size={13} color="var(--accent-primary)" />
                Popular in:
              </span>
              {popularCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSearchQuery(city);
                    const fleetElem = document.getElementById('fleet');
                    if (fleetElem) fleetElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.3rem 0.7rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-dim)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--accent-primary-dim)';
                    e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'var(--border-dim)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Metrics Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              textAlign: 'left',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-dim)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--accent-primary-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BadgeCheck size={17} color="var(--accent-primary)" strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#ffffff' }}>Zero Security Deposit</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>No blocked funds on credit cards</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--accent-emerald-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Tag size={17} color="var(--accent-emerald)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#ffffff' }}>Pre-Activated Fastag</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Automatic highway toll processing</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--accent-amber-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={17} color="var(--accent-amber)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#ffffff' }}>Full Insurance Included</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>GST, roadside assistance & road tax</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
