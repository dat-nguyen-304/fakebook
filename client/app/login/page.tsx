'use client';

import Register from '@/components/Auth/Register';
import Login from '@/components/Auth/Login';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import { useUser } from '@/hooks/client';

export default function Auth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user } = useUser();

  useEffect(() => {
    if (!user) setIsLoading(false);
    else setIsLoading(true);
  }, [user]);

  if (isLoading) return <Loading />;

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 bg-[#18191a]">
      <Login />
      {!isLoading && <Register />}
    </div>
  );
}
