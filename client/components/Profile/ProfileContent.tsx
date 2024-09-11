'use client';

import Posts from '@components/profile/Posts';
import Biography from './Biography';

interface ProfileContentProps {}
const ProfileContent: React.FC<ProfileContentProps> = () => {
  return (
    <div className="bg-[#18191a]">
      <div className="w-full max-w-[1036px] mx-auto h-[100vh] py-[16px] flex justify-between gap-4">
        <Biography />
        <Posts />
      </div>
    </div>
  );
};

export default ProfileContent;
