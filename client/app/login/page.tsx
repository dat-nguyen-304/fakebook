'use client';

import Register from '@/components/Auth/Register';
import Login from '@/components/Auth/Login';
import { useEffect, useState } from 'react';
import Loading from '../loading';
import { useUser } from '@/hooks';
import { useRouter } from 'next/navigation';
import { authApi } from '@/api-client/auth-api';
import { LoginResponseZod, UserZod } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

export default function Auth() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { user, onChangeUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (user) {
            router.push('/');
        } else if (accessToken && refreshToken) {
            const accessTkn = UserZod.parse(jwtDecode(accessToken));
            const refreshTkn = UserZod.parse(jwtDecode(refreshToken));

            if (accessTkn.exp * 1000 > new Date().getTime()) {
                onChangeUser(accessTkn);
                setIsLoading(false);
                router.push('/');
            } else if (refreshTkn.exp * 1000 > new Date().getTime()) {
                const refresh = async () => {
                    const response = await authApi.refresh(refreshToken);
                    handleToken(response);
                };
                refresh();
            }
        }
        setIsLoading(false);
    }, []);

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
                router.push('/');
            } else {
                toast.error(message);
            }
        } else toast.error('Please try again!');
    };

    if (isLoading) return <Loading />;

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 bg-[#18191a]">
            <Login handleToken={handleToken} />
            {!isLoading && <Register />}
        </div>
    );
}
