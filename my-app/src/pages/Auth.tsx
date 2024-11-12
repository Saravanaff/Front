import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const Auth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/');
      } else {
        try {
          const decodedToken = jwt.decode(token);

          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            router.push('/');
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
          router.push('/');
        }
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Add a display name for better debugging
  WithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
};

export default Auth;
