import React, {
  createContext, useCallback, useState, useContext, useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface Credentials {
  email: string;
  password: string;
}

interface AuthContextInterface {
  user: object;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => void;
  loading: boolean,
}

interface AuthState {
  token: string;
  user: object;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@goBarber:token',
        '@goBarber:user',
      ]);

      if (token[1] && user[1]) { setData({ token: token[1], user: JSON.parse(user[1]) }); }
    }

    loadStoredData();
    setLoading(false);
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@goBarber:token', token],
      ['@goBarber:user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@goBarber:token', '@goBarber:user']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{
      user: data.user, signIn, signOut, loading,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextInterface {
  const context = useContext(AuthContext);

  if (!context) throw Error('userAuth must be used within an AuthProvider');

  return context;
}

export { AuthProvider, useAuth };