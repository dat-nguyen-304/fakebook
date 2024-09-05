import { Tabs, useTab } from '@/hooks';
import { useRouter } from 'next/navigation';
import { FaHome, FaUser } from 'react-icons/fa';

interface HeaderTabsProps {}

const HeaderTabs: React.FC<HeaderTabsProps> = () => {
  const { tab, onChangeTab } = useTab();
  const router = useRouter();

  const goToHome = () => {
    onChangeTab(Tabs.HOME);
    router.push('/');
  };

  const goToFriends = () => {
    onChangeTab(Tabs.FRIEND);
    router.push('/friends');
  };

  return (
    <div className="flex items-center">
      <div
        className={`w-1/2 mx-[1px] flex justify-center items-center cursor-pointer ${tab === Tabs.HOME ? 'h-full border-b-[4px] border-b-[#0866ff] text-[#0866ff]' : 'h-[48px] rounded-lg hover:bg-[#3a3b3c] text-[#b0b3b8]'} `}
        onClick={goToHome}
      >
        <FaHome size={24} />
      </div>
      <div
        className={`w-1/2 mx-[1px] flex justify-center items-center cursor-pointer ${tab === Tabs.FRIEND ? 'h-full border-b-[4px] border-b-[#0866ff] text-[#0866ff]' : 'h-[48px] rounded-lg hover:bg-[#3a3b3c] text-[#b0b3b8]'}`}
        onClick={goToFriends}
      >
        <FaUser size={24} />
      </div>
    </div>
  );
};

export default HeaderTabs;
