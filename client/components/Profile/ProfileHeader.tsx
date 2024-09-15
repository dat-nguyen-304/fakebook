import { useState, useRef, useEffect } from 'react';
import { useMe } from '@hooks/api/auth';
import { uploadImageSocket } from '@socket/socket';
import { Id, toast } from 'react-toastify';
import Avatar from './Avatar';
import Cover from './Cover';

interface ProfileHeaderProps {}
const ProfileHeader: React.FC<ProfileHeaderProps> = () => {
  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
  const toastIdRef = useRef<Id>();
  const { data: me, refetch } = useMe();
  const user = me?.data;

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
    uploadImageSocket.on('connect', () => {
      const userId = user.id;
      uploadImageSocket.emit('join', userId);
    });

    uploadImageSocket.on('connect_error', err => {
      console.error('Connection error:', err);
    });

    uploadImageSocket.on('imageReady', data => {
      console.log('Image URL is ready:', data.imageUrl);
      toast.dismiss(toastIdRef.current);
      setIsLoadingAvatar(false);
      refetch();
    });

    uploadImageSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
    return () => {
      uploadImageSocket.disconnect();
    };
  }, [user?.id]);

  if (!user) return null;

  return (
    <div>
      <div className="mt-[56px] bg-gradient-to-b from-[#4c4a47] to-[#242526]">
        <div className="w-full max-w-[1100px] mx-auto">
          <Cover handleToast={handleToast} user={user} isLoading={isLoadingAvatar} />
          <Avatar handleToast={handleToast} user={user} isLoading={isLoadingAvatar} onLoading={setIsLoadingAvatar} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
