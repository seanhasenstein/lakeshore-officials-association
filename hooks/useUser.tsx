import React from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import { fetchUserByEmail } from '../utils/queries';
import { User } from '../interfaces';

interface UserProvider {
  children: React.ReactNode;
}

interface UserContextState {
  isLoading: boolean;
  isFetching: boolean;
  error: unknown | undefined;
  data: User | undefined;
}

const initialState = {
  isLoading: false,
  isFetching: false,
  error: undefined,
  data: undefined,
};

const UserContext = React.createContext<UserContextState>(initialState);
UserContext.displayName = 'UserContext';

export function useUser() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be wrapped in a UserProvider');
  }

  return context;
}

export function UserProvider({ children }: UserProvider) {
  const session = useSession();
  const [email, setEmail] = React.useState<string | null | undefined>();
  const query = useQuery(
    ['users', 'user', email],
    () => fetchUserByEmail(email),
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  React.useEffect(() => {
    if (session.status === 'authenticated') {
      setEmail(session.data.user?.email);
    }
  }, [session]);

  return (
    <UserContext.Provider
      value={{
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        data: query.data,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
