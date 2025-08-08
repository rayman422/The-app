import { useContext } from 'react';
import AuthContext from './useAuthContext.js';

export default function useAuth() {
  return useContext(AuthContext);
}