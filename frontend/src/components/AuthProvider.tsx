import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../services/api';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      // Pass the getToken function to the API service
      // This way, a fresh token is fetched on each request
      setTokenGetter(async () => {
        try {
          return await getToken();
        } catch (error) {
          console.error('Failed to get auth token:', error);
          return null;
        }
      });
    } else {
      // Clear the token getter when not signed in
      setTokenGetter(null);
    }
  }, [isSignedIn, getToken]);

  return <>{children}</>;
};

export default AuthProvider; 