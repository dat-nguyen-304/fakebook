'use client';

import HeaderNotification from './HeaderNotification';
import HeaderTabs from './HeaderTabs';
import HeaderSearch from './HeaderSearch';
import { useUser } from '@/hooks/client';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getTokens, setTokens } from '@/utils/tokens';
import { APIResponse, ITokensResponse, User } from '@/types';
import { useRefreshToken } from '@/hooks/api/auth';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user, onChangeUser } = useUser();
  const router = useRouter();

  const { mutate: callRefreshToken, data: tokens, isSuccess, isError } = useRefreshToken();

  useEffect(() => {
    if (isSuccess) handleToken(tokens);
    else if (isError) console.log('Refresh token error');
  }, [isSuccess, isError]);

  useEffect(() => {
    const { accessToken, refreshToken } = getTokens();

    if (!user) {
      if (accessToken && refreshToken) {
        const accessDecoded: User = jwtDecode(accessToken);
        const refreshDecoded: User = jwtDecode(refreshToken);

        if (accessDecoded.exp * 1000 > new Date().getTime()) {
          onChangeUser(accessDecoded);
          setIsLoading(false);
        } else if (refreshDecoded.exp * 1000 > new Date().getTime()) callRefreshToken({ refreshToken });
        else router.push('/login');
      } else return router.push('/login');
    }
    setIsLoading(false);
  }, [user]);

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

  if (isLoading)
    return <div className="grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 right-0 header" />;
  return (
    <div className="grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 right-0 header z-10">
      <HeaderSearch />
      <HeaderTabs />
      <HeaderNotification />
    </div>
  );
};

export default Header;
