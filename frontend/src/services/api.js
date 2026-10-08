import { auth } from '../firebase';

const API_BASE_URL = 'https://campusunstop.onrender.com/api';

const getAuthHeader = async () => {
  if (!auth.currentUser) return {};
  try {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return {};
  }
};

export const api = {
  // Sync Profile with Firebase
  syncUser: async (profileData = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(await getAuthHeader()),
    };
    const response = await fetch(`${API_BASE_URL}/auth/sync`, {
      method: 'POST',
      headers,
      body: JSON.stringify(profileData),
    });
    const result = await response.json();
    if (!response.ok) {
      throw result;
    }
    return result.user;
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: await getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Unable to load profile');
    }
    return response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
      body: JSON.stringify(profileData),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Unable to update profile');
    }
    return result;
  },

  // Events
  getEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Unable to load events');
    }
    return response.json();
  },

  getEventsByOrganizer: async (organizerId) => {
    const response = await fetch(`${API_BASE_URL}/events/organizer/${organizerId}`);
    return response.json();
  },

  searchEvents: async (query) => {
    const params = new URLSearchParams(query);
    const response = await fetch(`${API_BASE_URL}/events/search?${params}`);
    return response.json();
  },

  updateEvent: async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  },

  deleteEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
    });
    return response.json();
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  },

  // Bookings
  getUserBookings: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
      headers: await getAuthHeader(),
    });
    return response.json();
  },

  registerForEvent: async (userId, eventId) => {
    const response = await fetch(`${API_BASE_URL}/bookings/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeader()),
      },
      body: JSON.stringify({ userId, eventId }),
    });
    return response.json();
  },
};