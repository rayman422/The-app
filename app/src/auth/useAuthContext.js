import { createContext } from 'react';

const AuthContext = createContext({ user: null, loading: true });
export default AuthContext;