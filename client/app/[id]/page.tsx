'use client';

import ProfileContent from '@components/profile/ProfileContent';
import ProfileHeader from '@components/profile/ProfileHeader';

interface ProfileProps {}
const Profile: React.FC<ProfileProps> = () => {
  return (
    <div>
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
};

export default Profile;
