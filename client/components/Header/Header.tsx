'use client';

import HeaderNotification from './HeaderNotification';
import HeaderTabs from './HeaderTabs';
import HeaderSearch from './HeaderSearch';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 right-0 header z-10">
            <HeaderSearch />
            <HeaderTabs />
            <HeaderNotification />
        </div>
    );
};

export default Header;
