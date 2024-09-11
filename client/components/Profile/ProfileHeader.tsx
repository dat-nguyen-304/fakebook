import Image from 'next/image';
import { useState } from 'react';
import { FaCamera, FaPencilAlt } from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';
import EditAvatarModal from './EditAvatarModal';
import EditCoverModal from './EditCoverModal';

interface ProfileHeaderProps {}
const ProfileHeader: React.FC<ProfileHeaderProps> = () => {
  const [isOpenEditProfile, setIsOpenEditProfile] = useState<boolean>(false);
  const [isOpenEditAvatar, setIsOpenEditAvatar] = useState<boolean>(false);
  const [isOpenEditCover, setIsOpenEditCover] = useState<boolean>(false);

  return (
    <div>
      <div className="mt-[56px] bg-gradient-to-b from-[#4c4a47] to-[#242526]">
        <div className="w-full max-w-[1100px] mx-auto">
          <div className="relative">
            <Image
              src="/background.png"
              alt=""
              width={1280}
              height={853}
              className="w-full h-[406px] object-cover rounded-md"
            />
            <button
              onClick={() => setIsOpenEditCover(true)}
              className="absolute right-6 bottom-3 flex items-center gap-2 bg-white text-[#1e2024] py-1 px-2 text-[15px] font-semibold rounded-md"
            >
              <FaCamera size={16} color="#1e2024" />
              <span>Edit cover photo</span>
            </button>
          </div>
          <div className="px-[32px]">
            <div className="grid grid-cols-5 shadow-border-b h-[108px]">
              <div className="relative translate-y-[-50%] flex h-[168px] w-[168px]">
                <Image
                  src="/avatar.jpg"
                  alt=""
                  width={168}
                  height={168}
                  className="rounded-full object-cover w-[168px] h-[168px]"
                />
                <button
                  onClick={() => setIsOpenEditAvatar(true)}
                  className="absolute bottom-2 right-2 bg-[#3b3d3e] hover:bg-[#505153] p-[8px] rounded-full"
                >
                  <FaCamera size={20} color="#e4e6ea" />
                </button>
              </div>
              <div className="flex items-center justify-between w-full col-span-4 h-[96px]">
                <div className="">
                  <h3 className="text-[#e4e6eb] text-[32px] font-bold">Nguyễn Văn An</h3>
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
          </div>
        </div>
      </div>
      <EditProfileModal isOpen={isOpenEditProfile} onClose={() => setIsOpenEditProfile(false)} />
      <EditAvatarModal isOpen={isOpenEditAvatar} onClose={() => setIsOpenEditAvatar(false)} />
      <EditCoverModal isOpen={isOpenEditCover} onClose={() => setIsOpenEditCover(false)} />
    </div>
  );
};

export default ProfileHeader;
