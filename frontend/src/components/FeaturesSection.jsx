import React from 'react';
import { ShieldCheck, Zap, Sparkles, KeyRound, Clock, Headphones, Award, Tag, CheckCircle } from 'lucide-react';

export default function FeaturesSection() {
  const steps = [
    {
      number: '01',
      title: 'Select Vehicle',
      desc: 'Browse our verified fleet of self-drive hatchbacks, sedans, 4x4 SUVs, and electric cars.',
      icon: <KeyRound size={20} color="var(--accent-primary)" />,
    },
    {
      number: '02',
      title: 'Pick Dates',
      desc: 'Choose your rental period with automatic daily rate calculation and flexible drop-off.',
      icon: <Clock size={20} color="var(--accent-emerald)" />,
    },
    {
      number: '03',
      title: 'Instant Confirmation',
      desc: 'Lock in your booking directly with instant database synchronization and zero security deposit.',
      icon: <Zap size={20} color="var(--accent-amber)" />,
    },
    {
      number: '04',
      title: 'Hit the Highway',
      desc: 'Pick up keys at your nearest hub or get home delivery with pre-activated Fastag.',
      icon: <Sparkles size={20} color="var(--accent-indigo)" />,
    },
  ];

  const perks = [
    {
      title: 'Transparent Pricing in ₹ INR',
      desc: 'Comprehensive coverage, GST, and road taxes included with zero hidden charges at drop-off.',
      icon: <Award size={20} color="var(--accent-amber)" />,
    },
    {
      title: 'Pre-Installed Fastag Tolls',
      desc: 'Automatic electronic toll plaza clearance across all National & State highway expressways.',
      icon: <Tag size={20} color="var(--accent-primary)" />,
    },
    {
      title: '24x7 Roadside Assistance',
      desc: 'Pan-India breakdown support, towing, and emergency assistance on all routes.',
      icon: <Headphones size={20} color="var(--accent-emerald)" />,
    },
    {
      title: 'All-India Tourist Permit',
      desc: 'Drive freely across state borders with fully compliant commercial tourist documentation.',
      icon: <ShieldCheck size={20} color="var(--accent-rose)" />,
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Experience & Perks Section */}
      <section id="features" style={{ padding: '5rem 0', background: 'var(--bg-surface-1)', borderTop: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', marginBottom: '3rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Why Drive With Us
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', marginTop: '0.35rem', fontWeight: 800 }}>
              The Standards We Built Into Every Trip
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              We've eliminated friction so you can focus on the drive ahead.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {perks.map((perk, i) => (
              <div
                key={i}
                className="pro-card-interactive"
                style={{
                  padding: '1.75rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.9rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {perk.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  {perk.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55 }}>
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', borderTop: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ maxWidth: '600px', marginBottom: '3rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--accent-emerald)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              How it Works
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', marginTop: '0.35rem', fontWeight: 800 }}>
              On the Road in 4 Steps
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.95rem' }}>
              Simple, transparent self-drive booking in under 2 minutes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {steps.map((step) => (
              <div
                key={step.number}
                className="pro-card-interactive"
                style={{
                  padding: '1.75rem 1.5rem',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.25rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.25rem',
                    fontWeight: 800,
                    color: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {step.number}
                </span>

                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {step.icon}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: '#ffffff' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Minimal Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-dim)',
          padding: '3rem 0 2rem',
          background: 'var(--bg-app)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              paddingBottom: '1.75rem',
              borderBottom: '1px solid var(--border-dim)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: '#ffffff',
                  }}
                >
                  APEX<span style={{ color: 'var(--accent-primary)' }}>DRIVE</span>
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>INDIA</span>
              </div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                Self-Drive Car Rental Platform powered by FastAPI & PostgreSQL.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-emerald)',
                  }}
                />
                PostgreSQL Live Sync
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1.25rem',
              fontSize: '0.775rem',
              color: 'var(--text-tertiary)',
            }}
          >
            <span>© {new Date().getFullYear()} ApexDrive India. All rights reserved.</span>
            <span>Self-Drive Car Rentals • Indian Rupee (₹ INR)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}