'use client';

import Register from '@/components/Auth/Register';
import Login from '@/components/Auth/Login';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import { useUser } from '@/hooks/client';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/api/auth';

export default function Auth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { onChangeUser } = useUser();
  const router = useRouter();

  const { data: me, isPending, isSuccess, refetch } = useMe();

  useEffect(() => {
    if (isSuccess) {
      onChangeUser(me.data);
      router.push('/');
    } else if (isPending) {
      setIsLoading(true);
    }
    setIsLoading(false);
  }, [me, isSuccess, isPending]);

  if (isLoading) return <Loading />;

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 bg-[#18191a]">
      <Login refetch={refetch} />
      {!isLoading && <Register />}
    </div>
  );
}
