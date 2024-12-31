import axios from 'axios';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import app from '../config/firebase.js'; // Make sure you have this file

const API_BASE_URL = 'http://localhost:3000/api';
const auth = getAuth(app);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AuthService = {
  login: async (credentials) => {
    try {
      // First, get custom token from your backend
      const response = await api.post('/auth/login', credentials);
      const { customToken, user } = response.data;

      // Exchange custom token for ID token using Firebase
      const userCredential = await signInWithCustomToken(auth, customToken);
      const idToken = await userCredential.user.getIdToken();

      // Store the ID token and user data
      localStorage.setItem('authToken', idToken);
      localStorage.setItem('userData', JSON.stringify(user));

      return {
        token: idToken,
        user
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      // Register with backend and get custom token
      const response = await api.post('/auth/register', userData);
      const { customToken, user } = response.data;

      // Exchange custom token for ID token
      const userCredential = await signInWithCustomToken(auth, customToken);
      const idToken = await userCredential.user.getIdToken();

      // Store the ID token and user data
      localStorage.setItem('authToken', idToken);
      localStorage.setItem('userData', JSON.stringify(user));

      return {
        token: idToken,
        user
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if Firebase logout fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
  }
};

const PostService = {
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', postData.title);
      formData.append('description', postData.description || '');
      formData.append('location', postData.location);
      
      // Add images
      if (postData.images) {
        postData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      // Add videos
      if (postData.videos) {
        postData.videos.forEach((video) => {
          formData.append('videos', video);
        });
      }
      
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getFeed: async () => {
    try {
      const response = await api.get('/posts/feed');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getPost: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  likePost: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getLikes: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/likes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export { AuthService, PostService };
