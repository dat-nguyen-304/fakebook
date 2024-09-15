import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import EditCoverModal from './EditCoverModal';
import { User } from '@types';

interface CoverProps {
  user: User;
  handleToast: (action: 'loading' | 'dismiss' | 'error', message?: string) => void;
  isLoading: boolean;
  onLoading: Dispatch<SetStateAction<boolean>>;
}
const Cover: React.FC<CoverProps> = ({ user, handleToast, isLoading, onLoading }) => {
  const [isOpenEditCover, setIsOpenEditCover] = useState<boolean>(false);

  return (
    <div className="relative">
      <Image
        src={user.cover ?? './background.png'}
        alt=""
        width={1280}
        height={853}
        className="w-full h-[406px] object-cover rounded-md"
      />
      {isLoading ? <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.4)]" /> : null}
      <button
        onClick={() => setIsOpenEditCover(true)}
        className="absolute right-6 bottom-3 flex items-center gap-2 bg-white text-[#1e2024] py-1 px-2 text-[15px] font-semibold rounded-md"
      >
        <FaCamera size={16} color="#1e2024" />
        <span>Edit cover photo</span>
      </button>
      <EditCoverModal
        user={user}
        isOpen={isOpenEditCover}
        onClose={() => setIsOpenEditCover(false)}
        handleToast={handleToast}
        onLoadingCover={onLoading}
      />
    </div>
  );
};

export default Cover;
