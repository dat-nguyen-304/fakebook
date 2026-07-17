'use client';

import HeaderNotification from './HeaderNotification';
import HeaderTabs from './HeaderTabs';
import HeaderSearch from './HeaderSearch';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@hooks/api/user';
import { useOpenModal } from '@hooks/client/useOpenModal';
import cn from 'classnames';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  const { data: user, isSuccess, isError, isPending } = useMe();
  const { modalOpen } = useOpenModal();

  useEffect(() => {
    if (!user) {
      if (isError) {
        setIsLoading(true);
        return router.replace('/login');
      } else if (isPending) setIsLoading(true);
    } else setIsLoading(false);
  }, [user, isSuccess, isError]);

  if (isLoading)
    return (
      <div
        className={cn(
          'grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 header',
          modalOpen ? 'right-[16px]' : 'right-0'
        )}
      />
    );
  if (!user) return null;
  return (
    <header
      className={cn(
        'grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 shadow-border-b z-10',
        modalOpen ? 'right-[16px]' : 'right-0'
      )}
    >
      <HeaderSearch />
      <HeaderTabs />
      <HeaderNotification user={user} />
    </header>
  );
};

export default Header;
