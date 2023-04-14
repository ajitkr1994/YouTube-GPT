import axios from 'axios';
import { useRouter } from 'next/router';
import {useState, useEffect, createContext, useContext } from 'react';

interface IAuthContext {
  isAuthenticated: boolean
  loading: boolean
  error?: string
  user?: any
  login?: ({username, password}: {username: string, password: string}) => Promise<void>
}

const defaultState = {
  isAuthenticated: false,
  loading: false
}

const AuthContext = createContext<IAuthContext>(defaultState);

export const AuthProvider = ({children}: {children: any}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const login = async ({username, password}: {username: string, password: string}) => {
    try {
      setLoading(true);

      const res = await axios.post('/api/auth/login', {
        username,
        password
      });

      if (res.data.success) {
        setIsAuthenticated(true);

        setLoading(false);
        router.push('/');
      }

    } catch (error) {
      setLoading(false);
      setError(error.response && (error.response.data.detail || error.response.data.error));
    }
  }

  return (
    <AuthContext.Provider value={
      {
        loading,
        user,
        error,
        isAuthenticated,
        login
      }
    }>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;