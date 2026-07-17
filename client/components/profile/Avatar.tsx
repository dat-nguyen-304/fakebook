import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaCamera, FaPencilAlt } from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';
import EditAvatarModal from './EditAvatarModal';
import { User } from '@types';

interface AvatarProps {
  user: User;
  handleToast: (action: 'loading' | 'dismiss' | 'error', message?: string) => void;
  isLoading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
}
const Avatar: React.FC<AvatarProps> = ({ user, handleToast, isLoading, onLoading }) => {
  const [isOpenEditProfile, setIsOpenEditProfile] = useState<boolean>(false);
  const [isOpenEditAvatar, setIsOpenEditAvatar] = useState<boolean>(false);
  return (
    <div className="px-[32px]">
      <div className="grid grid-cols-5 shadow-border-b h-[108px]">
        <div className="relative translate-y-[-50%] flex h-[168px] w-[168px]">
          <Image
            src={user.avatar}
            alt="user-avatar"
            width={168}
            height={168}
            className="rounded-full object-cover w-[168px] h-[168px]"
          />
          {isLoading ? (
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.4)] rounded-full" />
          ) : null}
          <button
            onClick={() => setIsOpenEditAvatar(true)}
            className="absolute bottom-2 right-2 bg-[#3b3d3e] hover:bg-[#505153] p-[8px] rounded-full"
          >
            <FaCamera size={20} color="#e4e6ea" />
          </button>
        </div>
        <div className="flex items-center justify-between w-full col-span-4 h-[96px]">
          <div className="">
            <h3 className="text-[#e4e6eb] text-[32px] font-bold">{user.fullName}</h3>
            <p className="text-[#b3b0b8] text-[15px]">500 friends</p>
          </div>
          <div>
            <button
              onClick={() => setIsOpenEditProfile(true)}
              className="text-[#e4e6eb] text-[15px] font-semibold flex items-center gap-2 bg-[#3a3b3c] hover:bg-[#505153] rounded-md px-[12px] py-[6px]"
            >
              <FaPencilAlt />
              Edit profile
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center py-1 h-[54px]">
        <div
          className={`mx-[4px] px-4 flex justify-center items-center cursor-pointer h-full border-b-[4px] border-b-[#0866ff] text-[#0866ff] `}
        >
          Posts
        </div>
        <div
          className={`mx-[4px] px-4 flex justify-center items-center cursor-pointer h-[48px] rounded-lg hover:bg-[#3a3b3c] text-[#b0b3b8]`}
        >
          Friends
        </div>
        <div
          className={`mx-[4px] px-4 flex justify-center items-center cursor-pointer h-[48px] rounded-lg hover:bg-[#3a3b3c] text-[#b0b3b8]`}
        >
          Photos
        </div>
      </div>
      <EditProfileModal
        user={user}
        handleToast={handleToast}
        isOpen={isOpenEditProfile}
        onClose={() => setIsOpenEditProfile(false)}
      />
      <EditAvatarModal
        user={user}
        isOpen={isOpenEditAvatar}
        onClose={() => setIsOpenEditAvatar(false)}
        handleToast={handleToast}
        onLoadingAvatar={onLoading}
      />
    </div>
  );
};

export default Avatar;
