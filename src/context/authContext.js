import React, { createContext, useEffect, useState } from 'react';
import { getToken } from 'src/utils';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const data = await getToken();
      setToken(data);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
