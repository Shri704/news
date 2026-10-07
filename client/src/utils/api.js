// Shared API base — single source of truth for the whole client
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_BASE;
