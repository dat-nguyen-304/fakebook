'use client';

import Register from '@components/auth/Register';
import Login from '@components/auth/Login';
import { useEffect, useState } from 'react';
import Loading from '@app/loading';
import { useMe } from '@hooks/api/user';

export default function Auth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: user, refetch } = useMe();

  useEffect(() => {
    if (!user) setIsLoading(false);
    else setIsLoading(true);
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 bg-[#18191a]">
      <Login refetchUser={refetch} />
      {!isLoading && <Register />}
    </div>
  );
}
