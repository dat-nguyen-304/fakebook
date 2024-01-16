'use client';

import Login from '@/components/Auth/Register';
import Register from '@/components/Auth/Login';

export default function Auth() {
    return (
        <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-4 bg-[#18191a]">
            <Login />
            <Register />
        </div>
    );
}
