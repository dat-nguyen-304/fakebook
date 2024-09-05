'use client';

import HeaderNotification from './HeaderNotification';
import HeaderTabs from './HeaderTabs';
import HeaderSearch from './HeaderSearch';
import { authApi } from '@/api-client/auth-api';
import { useUser } from '@/hooks';
import { LoginResponseZod, UserZod } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user, onChangeUser } = useUser();
    const router = useRouter();
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!user) {
            if (accessToken && refreshToken) {
                const accessTkn = UserZod.parse(jwtDecode(accessToken));
                const refreshTkn = UserZod.parse(jwtDecode(refreshToken));

                if (accessTkn.exp * 1000 > new Date().getTime()) {
                    onChangeUser(accessTkn);
                    setIsLoading(false);
                } else if (refreshTkn.exp * 1000 > new Date().getTime()) {
                    const refresh = async () => {
                        const response = await authApi.refresh({ refreshToken });
                        handleToken(response);
                    };
                    refresh();
                } else {
                    router.push('/login');
                }
            } else {
                router.push('/login');
                return;
            }
        }
        setIsLoading(false);
    }, [user]);

    const handleToken = async (response: AxiosResponse<any, any> | undefined) => {
        if (response?.data) {
            const {
                accessToken,
                refreshToken,
                status: { success, message }
            } = LoginResponseZod.parse(response?.data);
            if (success) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                const user = UserZod.parse(jwtDecode(accessToken));
                onChangeUser(user);
                setIsLoading(false);
            } else {
                toast.error(message);
            }
        } else toast.error('Please try again!');
    };

    if (isLoading)
        return <div className="grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 right-0 header" />;
    return (
        <div className="grid grid-cols-3 px-2 h-[56px] bg-[#242526] fixed top-0 left-0 right-0 header z-10">
            <HeaderSearch />
            <HeaderTabs />
            <HeaderNotification />
        </div>
    );
};

export default Header;
