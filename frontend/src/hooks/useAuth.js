import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context.
 * Exposes: user, token, loading, login, register, logout, isAuthenticated
 */
export default function useAuth() {
  return useAuthContext();
}
