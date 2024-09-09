import { useLogout } from '@/hooks/api/auth';
import { useUser } from '@/hooks/client';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MdOutlineLogout } from 'react-icons/md';
import { toast } from 'react-toastify';

interface ProfileDropdownProps {
  isProfileOpen: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isProfileOpen }) => {
  const router = useRouter();
  const { mutate: logout, isError, isSuccess } = useLogout();
  const { onChangeUser } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      onChangeUser(null);
      queryClient.resetQueries({ queryKey: ['me'] });
      router.replace('/login');
    } else if (isError) toast.error('Logout failed');
  }, [isError, isSuccess]);

  if (!isProfileOpen) return null;
  return (
    <div className="fixed top-[57px] rounded-md shadow-md right-[20px] w-[360px] bg-[#242526] text-[#b0b3b8] p-[8px]">
      <div className="w-[94%] rounded-lg mx-auto bg-[#252728] hover:bg-[#3a3b3c] shadow-xl">
        <div className="flex items-center gap-2 mt-[10px] p-3 rounded-lg hover:cursor-pointer">
          <div className="w-[36px]">
            <Image src="/avatar.jpg" alt="" width={36} height={36} className="rounded-full" />
          </div>
          <p className="text-[#e4e6eb]">Nguyễn Văn An</p>
        </div>
      </div>

      <div className="my-4 h-[1px] w-[90%] mx-auto bg-[#65686c]" />

      <div className='w-[98%] rounded-lg mx-auto hover:bg-[#3c3d3f] shadow-xl"' onClick={() => logout()}>
        <div className="flex items-center gap-2 mt-[10px] p-3 rounded-lg hover:cursor-pointer group">
          <div className="flex justify-center items-center rounded-full w-[36px] h-[36px] bg-[#3b3d3e] group-hover:bg-[#4e504f] shadow-xl">
            <MdOutlineLogout size={20} className="text-[#e4e6ea]" />
          </div>
          <p className="text-[#e4e6eb] text-[15px]">Log Out</p>
        </div>
      </div>

      <div className="px-4">
        <span className="text-[13px] text-[#b3b0b8]">
          Privacy · Terms · Advertising · Ad choices · Cookie · More · Fakebook © 2024
        </span>
      </div>
    </div>
  );
};

export default ProfileDropdown;
