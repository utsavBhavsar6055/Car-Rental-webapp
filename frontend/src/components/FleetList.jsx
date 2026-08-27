import React, { useState } from 'react';
import CarCard from './CarCard';
import { SlidersHorizontal, Car as CarIcon, Plus, RefreshCw, Layers } from 'lucide-react';

export default function FleetList({
  cars = [],
  loading = false,
  searchQuery = '',
  selectedFuel = 'All',
  setSelectedFuel,
  onRent,
  onDelete,
  onAddCar,
  onRefresh,
}) {
  const [sortBy, setSortBy] = useState('price-asc');

  // Filter cars based on search keyword and fuel type
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      (car.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (car.fuel_type || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFuel =
      selectedFuel === 'All' ||
      (car.fuel_type || '').toLowerCase() === selectedFuel.toLowerCase();

    return matchesSearch && matchesFuel;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price_per_day - b.price_per_day;
    if (sortBy === 'price-desc') return b.price_per_day - a.price_per_day;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const fuelTabs = [
    { label: 'All Fleet', value: 'All' },
    { label: 'Petrol', value: 'Petrol' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Electric', value: 'Electric' },
  ];

  return (
    <section id="fleet" style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Verified Inventory
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, marginTop: '0.2rem' }}>
              Available Self-Drive Cars
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
              Showing {sortedCars.length} cars available for instant booking in India
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={onRefresh}
              className="btn btn-secondary btn-sm"
              title="Refresh inventory"
              id="fleet-refresh-btn"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onAddCar}
              className="btn btn-primary btn-sm"
              id="fleet-add-car-btn"
            >
              <Plus size={15} />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div
          className="pro-card"
          style={{
            padding: '0.75rem 1rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
            background: 'var(--bg-surface-2)',
          }}
        >
          {/* Segmented Fuel Filter Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              alignItems: 'center',
            }}
          >
            {fuelTabs.map((tab) => {
              const active = selectedFuel.toLowerCase() === tab.value.toLowerCase();
              const count =
                tab.value === 'All'
                  ? cars.length
                  : cars.filter((c) => (c.fuel_type || '').toLowerCase() === tab.value.toLowerCase()).length;

              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedFuel(tab.value)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    transition: 'all 0.15s',
                    background: active
                      ? 'var(--accent-primary)'
                      : 'transparent',
                    borderColor: active ? 'var(--accent-primary)' : 'transparent',
                    color: active ? '#06101e' : 'var(--text-secondary)',
                  }}
                  id={`fuel-tab-${tab.value.toLowerCase()}`}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '3px',
                      background: active ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                      color: active ? '#06101e' : 'var(--text-tertiary)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{
                width: 'auto',
                padding: '0.35rem 0.75rem',
                fontSize: '0.825rem',
                height: 'auto',
              }}
              id="fleet-sort-select"
            >
              <option value="price-asc">Price (₹): Low to High</option>
              <option value="price-desc">Price (₹): High to Low</option>
              <option value="name-asc">Model Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div
            style={{
              padding: '5rem 0',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <RefreshCw
              size={32}
              color="var(--accent-primary)"
              style={{ animation: 'spin 1.2s linear infinite' }}
            />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Loading cars from PostgreSQL...
            </p>
          </div>
        ) : sortedCars.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {sortedCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onRent={onRent}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="pro-card"
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--accent-primary-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <CarIcon size={26} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem', color: '#ffffff' }}>
              No Cars Match Your Filter
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Try resetting your search query or powertrain filter to view all cars in the database.
            </p>

            <button
              onClick={() => {
                setSelectedFuel('All');
              }}
              className="btn btn-secondary btn-sm"
              id="reset-filter-btn"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
