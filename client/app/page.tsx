'use client';

import { authApi } from '@/api-client/auth-api';
import ChatBox from '@/components/Chat/ChatBox';
import Content from '@/components/Content/Content';
import Header from '@/components/Header/Header';
import { useUser } from '@/hooks';
import { LoginResponseZod, UserZod } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Loading from './loading';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';

interface AppProps {}

const App: React.FC<AppProps> = () => {
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
                        const response = await authApi.refresh(refreshToken);
                        handleToken(response);
                    };
                    refresh();
                } else {
                    router.push('/login');
                }
            } else {
                router.push('/login');
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
            } else {
                toast.error(message);
            }
        } else toast.error('Please try again!');
    };

    if (isLoading) return <Loading />;

    return (
        <>
            <Header />
            <Content />
            <ChatBox />
        </>
    );
};

export default App;
