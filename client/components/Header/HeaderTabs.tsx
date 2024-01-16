import { useState } from 'react';
import { FaHome, FaUser } from 'react-icons/fa';

interface HeaderTabsProps {}
enum Tabs {
    HOME = 1,
    FRIEND = 2
}
const HeaderTabs: React.FC<HeaderTabsProps> = () => {
    const [selectedTab, setSelectedTab] = useState<Tabs>(Tabs.HOME);

    return (
        <div className="flex items-center">
            <div
                className={`w-1/2 mx-[1px] flex justify-center items-center ${selectedTab === Tabs.HOME ? 'h-full border-b-[4px] border-b-[#0866ff] text-[#0866ff]' : 'h-[48px] rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer text-[#b0b3b8]'} `}
                onClick={() => setSelectedTab(Tabs.HOME)}
            >
                <FaHome size={24} />
            </div>
            <div
                className={`w-1/2 mx-[1px] flex justify-center items-center ${selectedTab === Tabs.FRIEND ? 'h-full border-b-[4px] border-b-[#0866ff] text-[#0866ff]' : 'h-[48px] rounded-lg hover:bg-[#3a3b3c] hover:cursor-pointer text-[#b0b3b8]'}`}
                onClick={() => setSelectedTab(Tabs.FRIEND)}
            >
                <FaUser size={24} />
            </div>
        </div>
    );
};

export default HeaderTabs;
