const API_BASE =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMsg = data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
      } else if (data.message) {
        errorMsg = data.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

async function safeFetch(url, options = {}) {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to backend server at ${API_BASE}. Please ensure FastAPI is running.`
      );
    }
    throw err;
  }
}

export const api = {
  // AI assistant
  async sendChatMessage(message, { dateFrom, dateTo } = {}) {
    const res = await safeFetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        ...(dateFrom ? { date_from: `${dateFrom}T00:00:00` } : {}),
        ...(dateTo ? { date_to: `${dateTo}T00:00:00` } : {}),
      }),
    });
    return handleResponse(res);
  },

  // Cars
  async getCars(dateFrom, dateTo) {
    const query = new URLSearchParams({
      date_from: `${dateFrom}T00:00:00`,
      date_to: `${dateTo}T00:00:00`,
    });
    const res = await safeFetch(`${API_BASE}/showcar?${query.toString()}`);
    return handleResponse(res);
  },

  async createCar(carData) {
    const res = await safeFetch(`${API_BASE}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        name: carData.name,
        fuel_type: carData.fuel_type,
        price_per_day: parseInt(carData.price_per_day, 10),
        phone: carData.phone || '',
      }),
    });
    return handleResponse(res);
  },

  async deleteCar(carId) {
    const res = await safeFetch(`${API_BASE}/cars/${carId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(res);
  },

  // Auth
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await safeFetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    return handleResponse(res);
  },

  async register(name, username, password) {
    const res = await safeFetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await safeFetch(`${API_BASE}/me`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(res);
  },

  // Rentals
  async createRental({ car_id, date_from, date_to, total_amt }) {
    const res = await safeFetch(`${API_BASE}/rental`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        car_id: parseInt(car_id, 10),
        date_from: date_from,
        date_to: date_to,
        total_amt: parseInt(total_amt, 10),
      }),
    });
    return handleResponse(res);
  },

  async getMyRentals() {
    const res = await safeFetch(`${API_BASE}/my-rentals`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return handleResponse(res);
  },
};
