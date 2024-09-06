'use client';

import Register from '@/components/Auth/Register';
import Login from '@/components/Auth/Login';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import { useUser } from '@/hooks/client';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { getTokens, setTokens } from '@/utils/tokens';
import { APIResponse, ITokensResponse, User } from '@/types';
import { useRefreshToken } from '@/hooks/api/auth';

export default function Auth() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user, onChangeUser } = useUser();
  const router = useRouter();

  const { mutate: callRefreshToken, data: tokens, isSuccess, isError } = useRefreshToken();

  useEffect(() => {
    const { accessToken, refreshToken } = getTokens();
    if (user) {
      router.push('/');
    } else if (accessToken && refreshToken) {
      const accessDecoded: User = jwtDecode(accessToken);
      const refreshDecoded: User = jwtDecode(refreshToken);

      if (accessDecoded.exp * 1000 > new Date().getTime()) {
        onChangeUser(refreshDecoded);
        setIsLoading(false);
        router.push('/');
      } else if (refreshDecoded.exp * 1000 > new Date().getTime()) {
        callRefreshToken({ refreshToken });
      }
    }
    setIsLoading(false);
  }, []);

  const handleToken = (response: APIResponse<ITokensResponse>) => {
    const { accessToken, refreshToken } = response.data;
    if (response.success) {
      setTokens(accessToken, refreshToken);
      const user: User = jwtDecode(accessToken);
      onChangeUser(user);
      setIsLoading(false);
      router.push('/');
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (isSuccess) handleToken(tokens);
    else if (isError) console.log('Refresh token error');
  }, [isSuccess, isError]);

  if (isLoading) return <Loading />;

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 bg-[#18191a]">
      <Login handleToken={handleToken} />
      {!isLoading && <Register />}
    </div>
  );
}
