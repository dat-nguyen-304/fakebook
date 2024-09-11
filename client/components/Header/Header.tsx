'use client';

import HeaderNotification from './HeaderNotification';
import HeaderTabs from './HeaderTabs';
import HeaderSearch from './HeaderSearch';
import { useUser } from '@hooks/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@hooks/api/auth';
import { useOpenModal } from '@hooks/client/useOpenModal';
import cn from 'classnames';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user, onChangeUser } = useUser();
  const router = useRouter();

  const { data: me, isSuccess, isError, isPending } = useMe();
  const { modalOpen } = useOpenModal();

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
    return (
      <div
        className={cn(
          'grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 header',
          modalOpen ? 'right-[16px]' : 'right-0'
        )}
      />
    );
  return (
    <header
      className={cn(
        'grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 shadow-border-b z-10',
        modalOpen ? 'right-[16px]' : 'right-0'
      )}
    >
      <HeaderSearch />
      <HeaderTabs />
      <HeaderNotification />
    </header>
  );
};

export default Header;
