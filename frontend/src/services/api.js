/**
 * API Service - Servicios para comunicación con el backend
 * CONECTADO AL BACKEND REAL
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Helper para hacer requests
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
};

// ============================================
// AUTH - Autenticación
// ============================================

export const authAPI = {
  login: async (credentials) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    return {
      token: response.access_token,
      user: response.user
    };
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// ============================================
// PAGES - Manejo de páginas CMS
// ============================================

export const pagesAPI = {
  getAll: async () => {
    return fetchWithAuth(`${API_BASE_URL}/pages`);
  },

  getBySlug: async (slug) => {
    return fetchWithAuth(`${API_BASE_URL}/pages/${slug}`);
  },

  update: async (slug, data) => {
    return fetchWithAuth(`${API_BASE_URL}/pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

// ============================================
// PREDICTION - Análisis de imágenes con IA
// ============================================

export const predictionAPI = {
  analyze: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const AI_MODEL_URL = process.env.REACT_APP_AI_MODEL_URL || 'http://localhost:8000/api/predict';

    const response = await fetch(AI_MODEL_URL, {
      method: 'POST',
      body: formData,
      headers: {
        // NO incluir Content-Type para que el browser lo setee automáticamente con boundary
      }
    });

    if (!response.ok) {
      throw new Error('Error en el análisis de la imagen');
    }

    return response.json();
  }
};

// ============================================
// UI TEXTS - Textos reutilizables (no implementado en backend aún)
// ============================================

export const uiTextsAPI = {
  getAll: async () => {
    // Por ahora mock - puedes implementar en el backend si lo necesitas
    return Promise.resolve([
      { key: 'upload_button_text', value: 'Subir imagen y analizar', category: 'button' },
      { key: 'hero_cta', value: 'Comenzar Análisis', category: 'button' }
    ]);
  },

  update: async (key, value) => {
    console.log('Actualizando texto UI:', key, value);
    return Promise.resolve({ success: true });
  }
};

export default {
  auth: authAPI,
  pages: pagesAPI,
  prediction: predictionAPI,
  uiTexts: uiTextsAPI
};
