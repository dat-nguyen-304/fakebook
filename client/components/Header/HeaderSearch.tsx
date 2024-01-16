import Image from 'next/image';
import { FaBell } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { PiMessengerLogoFill } from 'react-icons/pi';

interface HeaderSearchProps {}
const HeaderSearch: React.FC<HeaderSearchProps> = () => {
    return (
        <div className="flex items-center">
            <Image src="/logo.svg" alt="" width={50} height={50} className="h-[56px]" />
            <div className="px-4 h-[40px] bg-[#3a3b3c] rounded-full flex items-center">
                <IoSearch className="text-[#b0b3b8] text-[18px]" />
                <input
                    className="ml-2 text-[15px] font-thin outline-none bg-transparent text-white"
                    placeholder="Search Facebook"
                />
            </div>
        </div>
    );
};

export default HeaderSearch;
