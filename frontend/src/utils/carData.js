// Curated high-definition images for Indian and luxury vehicles
export function getCarImage(carName = '', fuelType = '') {
  const name = (carName || '').toLowerCase().trim();
  const fuel = (fuelType || '').toLowerCase().trim();

  // Maruti Swift
  if (name.includes('swift')) {
    return 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80';
  }
  // Maruti Ertiga / MPV
  if (name.includes('ertiga') || name.includes('innova') || name.includes('carens') || name.includes('triber')) {
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80';
  }
  // Toyota Fortuner / SUV
  if (name.includes('fortuner') || name.includes('endeavour') || name.includes('scorpio') || name.includes('safari') || name.includes('harrier')) {
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';
  }
  // Mahindra Thar / Offroad
  if (name.includes('thar') || name.includes('jimny') || name.includes('gurkha') || name.includes('wrangler')) {
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80';
  }
  // Toyota Camry / Premium Executive Sedan
  if (name.includes('camry') || name.includes('accord') || name.includes('superb') || name.includes('octavia') || name.includes('slavia') || name.includes('virtus') || name.includes('city') || name.includes('verna')) {
    return 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80';
  }
  // Tata Nexon EV / Electric Cars
  if (name.includes('nexon') || name.includes('curvv') || name.includes('ev6') || name.includes('ioniq') || name.includes('tesla') || fuel.includes('electric') || fuel.includes('ev')) {
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80';
  }
  // Porsche / Performance Supercars
  if (name.includes('porsche') || name.includes('911') || name.includes('ferrari') || name.includes('lamborghini')) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';
  }
  // BMW
  if (name.includes('bmw') || name.includes('m3') || name.includes('m4') || name.includes('m5') || name.includes('m8') || name.includes('x5') || name.includes('x7')) {
    return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80';
  }
  // Mercedes-Benz
  if (name.includes('mercedes') || name.includes('benz') || name.includes('amg') || name.includes('glc') || name.includes('gle') || name.includes('g-wagon')) {
    return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80';
  }
  // Audi
  if (name.includes('audi') || name.includes('a4') || name.includes('a6') || name.includes('q7') || name.includes('rs')) {
    return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80';
  }

  // Stable fallback rotation
  const fallbacks = [
    'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return fallbacks[Math.abs(hash) % fallbacks.length];
}

export function getCarSpecs(carName = '', fuelType = '') {
  const name = (carName || '').toLowerCase();
  const fuel = (fuelType || '').toLowerCase();
  const isElectric = fuel.includes('electric') || fuel.includes('ev');
  const isHybrid = fuel.includes('hybrid');
  const isDiesel = fuel.includes('diesel');

  if (name.includes('ertiga') || name.includes('innova') || name.includes('safari')) {
    return {
      seats: '7 Seater MPV',
      transmission: 'Manual / Automatic',
      mileage: isDiesel ? '19.8 km/l' : '16.5 km/l',
      features: 'Fastag Enabled',
    };
  }

  if (name.includes('fortuner') || name.includes('endeavour') || name.includes('scorpio') || name.includes('thar')) {
    return {
      seats: name.includes('thar') ? '4 Seater 4x4' : '7 Seater 4x4',
      transmission: 'Automatic / Manual',
      mileage: '14.2 km/l Turbo',
      features: 'All-India Permit',
    };
  }

  if (name.includes('swift') || name.includes('i20') || name.includes('baleno') || name.includes('altroz')) {
    return {
      seats: '5 Seater Hatch',
      transmission: '5-Speed MT / AMT',
      mileage: '22.5 km/l',
      features: 'Fastag Enabled',
    };
  }

  return {
    seats: isElectric ? '5 Seater EV' : '5 Seater Sedan',
    transmission: isElectric ? 'Single Speed Auto' : isHybrid ? 'e-CVT Hybrid' : 'Automatic',
    mileage: isElectric ? '450 km Range' : isHybrid ? '23.8 km/l' : '17.5 km/l',
    features: 'AC & Airbags',
  };
}

export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
