import { useState, useRef, useEffect } from 'react';
import { useMe } from '@hooks/api/user';
import { Id, toast } from 'react-toastify';
import Avatar from './Avatar';
import Cover from './Cover';
import { notificationSocket } from '@socket/socket';

interface ProfileHeaderProps {}
const ProfileHeader: React.FC<ProfileHeaderProps> = () => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
  const [isLoadingCover, setIsLoadingCover] = useState<boolean>(false);

  const toastIdRef = useRef<Id>();
  const { data: user, refetch } = useMe();

  const handleToast = (action: 'loading' | 'dismiss' | 'error', message?: string) => {
    if (action === 'loading') {
      toastIdRef.current = toast.loading('Loading');
    } else if (action === 'dismiss' && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    } else if (action === 'error' && toastIdRef.current) {
      toast.error(message ?? 'Something wrong');
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    notificationSocket.on('image-ready', data => {
      toast.dismiss(toastIdRef.current);
      if (data.type === 'avatar') setIsLoadingAvatar(false);
      else setIsLoadingCover(false);
      refetch();
    });

    return () => {
      notificationSocket.off('image-ready');
    };
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="mt-[56px] bg-gradient-to-b from-[#4c4a47] to-[#242526]">
      <div className="w-full max-w-[1100px] mx-auto">
        <Cover handleToast={handleToast} user={user} isLoading={isLoadingCover} onLoading={setIsLoadingCover} />
        <Avatar handleToast={handleToast} user={user} isLoading={isLoadingAvatar} onLoading={setIsLoadingAvatar} />
      </div>
    </div>
  );
};

export default ProfileHeader;
