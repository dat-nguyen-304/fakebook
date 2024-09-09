'use client';

import HeaderNotification from './HeaderNotification';
import HeaderTabs from './HeaderTabs';
import HeaderSearch from './HeaderSearch';
import { useUser } from '@/hooks/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/api/auth';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user, onChangeUser } = useUser();
  const router = useRouter();

  const { data: me, isSuccess, isError, isPending } = useMe();

  useEffect(() => {
    if (!user) {
      if (isSuccess) {
        onChangeUser(me.data);
      } else if (isError) {
        onChangeUser(null);
        setIsLoading(true);
        return router.replace('/login');
      } else if (isPending) setIsLoading(true);
    } else setIsLoading(false);
  }, [user, me, isSuccess, isError]);

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
